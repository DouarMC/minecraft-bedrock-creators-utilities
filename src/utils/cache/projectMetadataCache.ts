import * as vscode from "vscode";
import { ProjectMetadata } from "../../types/projectMetadata";

/**
 * Interface pour les données de projet mises en cache
 */
export interface ProjectCacheData {
    /** Métadonnées du projet */
    metadata: ProjectMetadata | undefined;
    /** Timestamp de dernière lecture */
    timestamp: number;
    /** Version du fichier pour détecter les changements */
    fileStats?: vscode.FileStat;
}

/**
 * Cache intelligent pour les métadonnées de projet avec surveillance de fichier
 */
export class ProjectMetadataCache {
    private cache = new Map<string, ProjectCacheData>();
    private maxAge = 30 * 1000; // 30 secondes - plus court car les métadonnées changent rarement
    private fileWatchers = new Map<string, vscode.FileSystemWatcher>();

    /**
     * Récupère les métadonnées mises en cache pour un dossier
     */
    async get(folderUri: vscode.Uri): Promise<ProjectMetadata | undefined> {
        const key = folderUri.toString();
        const cached = this.cache.get(key);
        
        if (!cached) {
            return this.loadAndCache(folderUri);
        }

        // Vérification de l'âge du cache
        if (Date.now() - cached.timestamp > this.maxAge) {
            return this.loadAndCache(folderUri);
        }

        // Vérification des modifications du fichier
        try {
            const metadataFileUri = vscode.Uri.joinPath(folderUri, ".minecraft-project.json");
            const currentStats = await vscode.workspace.fs.stat(metadataFileUri);
            
            if (cached.fileStats && currentStats.mtime !== cached.fileStats.mtime) {
                return this.loadAndCache(folderUri);
            }
        } catch {
            // Fichier n'existe plus ou erreur d'accès
            this.cache.delete(key);
            return undefined;
        }

        return cached.metadata;
    }

    /**
     * Version synchrone pour compatibilité avec l'ancien système
     */
    getSync(folderUri: vscode.Uri): ProjectMetadata | undefined {
        const key = folderUri.toString();
        const cached = this.cache.get(key);
        
        if (!cached) {
            return this.loadAndCacheSync(folderUri);
        }

        // Pour la version synchrone, on accepte un cache plus ancien
        if (Date.now() - cached.timestamp > this.maxAge * 2) {
            return this.loadAndCacheSync(folderUri);
        }

        return cached.metadata;
    }

    /**
     * Charge et met en cache les métadonnées de projet (version asynchrone)
     */
    private async loadAndCache(folderUri: vscode.Uri): Promise<ProjectMetadata | undefined> {
        const key = folderUri.toString();
        const metadataFileUri = vscode.Uri.joinPath(folderUri, ".minecraft-project.json");

        try {
            const content = await vscode.workspace.fs.readFile(metadataFileUri);
            const fileStats = await vscode.workspace.fs.stat(metadataFileUri);
            const text = new TextDecoder().decode(content);
            const metadata = JSON.parse(text) as ProjectMetadata;

            // Validation des métadonnées
            if (!metadata.type || !metadata.id || !metadata.minecraftProduct) {
                this.cache.set(key, {
                    metadata: undefined,
                    timestamp: Date.now(),
                    fileStats
                });
                return undefined;
            }

            this.cache.set(key, {
                metadata,
                timestamp: Date.now(),
                fileStats
            });

            // Configuration du watcher si pas déjà fait
            this.setupFileWatcher(folderUri);

            return metadata;
        } catch (error) {
            this.cache.set(key, {
                metadata: undefined,
                timestamp: Date.now()
            });
            return undefined;
        }
    }

    /**
     * Charge et met en cache les métadonnées de projet (version synchrone)
     */
    private loadAndCacheSync(folderUri: vscode.Uri): ProjectMetadata | undefined {
        const key = folderUri.toString();
        const metadataFileUri = vscode.Uri.joinPath(folderUri, ".minecraft-project.json");

        try {
            const fs = require('fs');
            const content = fs.readFileSync(metadataFileUri.fsPath);
            const text = new TextDecoder().decode(content);
            const metadata = JSON.parse(text) as ProjectMetadata;

            // Validation des métadonnées
            if (!metadata.type || !metadata.id || !metadata.minecraftProduct) {
                this.cache.set(key, {
                    metadata: undefined,
                    timestamp: Date.now()
                });
                return undefined;
            }

            this.cache.set(key, {
                metadata,
                timestamp: Date.now()
            });

            // Configuration du watcher si pas déjà fait
            this.setupFileWatcher(folderUri);

            return metadata;
        } catch (error) {
            this.cache.set(key, {
                metadata: undefined,
                timestamp: Date.now()
            });
            return undefined;
        }
    }

    /**
     * Configure un watcher pour surveiller les changements du fichier de métadonnées
     */
    private setupFileWatcher(folderUri: vscode.Uri): void {
        const key = folderUri.toString();
        
        if (this.fileWatchers.has(key)) {
            return;
        }

        const pattern = new vscode.RelativePattern(folderUri, ".minecraft-project.json");
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);

        watcher.onDidChange(() => this.invalidate(folderUri));
        watcher.onDidCreate(() => this.invalidate(folderUri));
        watcher.onDidDelete(() => this.invalidate(folderUri));

        this.fileWatchers.set(key, watcher);
    }

    /**
     * Invalide le cache pour un dossier spécifique
     */
    invalidate(folderUri: vscode.Uri): void {
        const key = folderUri.toString();
        this.cache.delete(key);
    }

    /**
     * Invalide tout le cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Nettoie les ressources (watchers)
     */
    dispose(): void {
        for (const watcher of this.fileWatchers.values()) {
            watcher.dispose();
        }
        this.fileWatchers.clear();
        this.cache.clear();
    }

    /**
     * Retourne les statistiques du cache pour le debugging
     */
    getStats(): { size: number; watchedFolders: number } {
        return {
            size: this.cache.size,
            watchedFolders: this.fileWatchers.size
        };
    }
}

// Instance globale du cache de métadonnées projet
export const projectMetadataCache = new ProjectMetadataCache();
