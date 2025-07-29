import * as vscode from "vscode";
import { CacheManager } from "../utils/cache";

/**
 * Gestionnaire de cache pour l'extension avec intégration VS Code
 */
export class ExtensionCacheManager {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.setupCacheManagement();
    }

    /**
     * Configure la gestion des caches pour l'extension
     */
    private setupCacheManagement(): void {
        // Commande pour vider les caches
        this.context.subscriptions.push(
            vscode.commands.registerCommand('minecraft-bedrock-creators-utilities.clearCaches', () => {
                CacheManager.clearAll();
                vscode.window.showInformationMessage('Tous les caches ont été vidés avec succès.');
            })
        );

        // Commande pour afficher les statistiques des caches
        this.context.subscriptions.push(
            vscode.commands.registerCommand('minecraft-bedrock-creators-utilities.showCacheStats', () => {
                const stats = CacheManager.getGlobalStats();
                const message = `
Cache des Documents: ${stats.documents.size}/${stats.documents.maxSize}
Cache des Projets: ${stats.projects.size} projets surveillés
Cache des Schémas: ${stats.schemas.size}/${stats.schemas.maxSize}
                `.trim();
                
                vscode.window.showInformationMessage(message, { modal: true });
            })
        );

        // Surveillance des changements de workspace
        this.setupWorkspaceWatching();

        // Nettoyage des caches lors de la fermeture
        this.context.subscriptions.push({
            dispose: () => {
                CacheManager.dispose();
            }
        });
    }

    /**
     * Configure la surveillance des changements de workspace
     */
    private setupWorkspaceWatching(): void {
        // Invalidation des caches lors de changements de métadonnées projet
        const projectWatcher = vscode.workspace.createFileSystemWatcher('**/.minecraft-project.json');
        
        projectWatcher.onDidChange(() => {
            CacheManager.invalidateByChangeType('project');
        });
        
        projectWatcher.onDidCreate(() => {
            CacheManager.invalidateByChangeType('project');
        });
        
        projectWatcher.onDidDelete(() => {
            CacheManager.invalidateByChangeType('project');
        });

        this.context.subscriptions.push(projectWatcher);

        // Invalidation spécifique pour les fichiers de schéma (si l'extension est mise à jour)
        const extensionWatcher = vscode.workspace.createFileSystemWatcher('**/minecraft-bedrock-creators-utilities/**');
        
        extensionWatcher.onDidChange(() => {
            CacheManager.invalidateByChangeType('schema');
        });

        this.context.subscriptions.push(extensionWatcher);
    }

    /**
     * Invalide les caches de manière intelligente basée sur le type de changement
     */
    invalidateByType(type: 'schema' | 'project' | 'document', identifier?: string): void {
        CacheManager.invalidateByChangeType(type, identifier);
    }

    /**
     * Retourne les statistiques globales des caches
     */
    getStats(): any {
        return CacheManager.getGlobalStats();
    }
}
