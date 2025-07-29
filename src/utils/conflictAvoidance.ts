import * as vscode from "vscode";

/**
 * Utilitaires pour détecter et éviter les conflits avec d'autres extensions/systèmes
 */
export class ConflictAvoidance {
    
    /**
     * Vérifie si un document est un fichier Minecraft Bedrock
     */
    static isMinecraftBedrockFile(document: vscode.TextDocument): boolean {
        const filePath = document.uri.fsPath.replace(/\\/g, '/').toLowerCase();
        
        // Patterns pour identifier les fichiers Minecraft Bedrock
        const minecraftPatterns = [
            '/behavior_pack/',
            '/behavior_packs/',
            '/resource_pack/',
            '/resource_packs/',
            '/addon/',
            '/addons/',
            '/development_behavior_packs/',
            '/development_resource_packs/'
        ];

        return minecraftPatterns.some(pattern => filePath.includes(pattern));
    }

    /**
     * Vérifie si le document contient des structures Minecraft
     */
    static hasMinecraftStructure(document: vscode.TextDocument): boolean {
        try {
            const content = document.getText();
            if (!content.trim()) return false;

            const json = JSON.parse(content);
            
            // Identifiants spécifiques à Minecraft
            const minecraftKeys = [
                'minecraft:entity',
                'minecraft:item',
                'minecraft:block',
                'minecraft:biome',
                'minecraft:animation',
                'minecraft:animation_controller',
                'minecraft:loot_table',
                'minecraft:recipe',
                'minecraft:spawn_rules',
                'minecraft:trading',
                'format_version'
            ];

            return minecraftKeys.some(key => json.hasOwnProperty(key));
        } catch {
            return false;
        }
    }

    /**
     * Détermine si notre extension doit traiter ce document
     */
    static shouldHandleDocument(document: vscode.TextDocument): boolean {
        // Ne traiter que les fichiers JSON/JSONC
        if (document.languageId !== 'json' && document.languageId !== 'jsonc') {
            return false;
        }

        // Vérifier d'abord le chemin de fichier (plus rapide)
        if (this.isMinecraftBedrockFile(document)) {
            return true;
        }

        // Si le chemin ne correspond pas, vérifier le contenu (plus lent)
        return this.hasMinecraftStructure(document);
    }

    /**
     * Ajoute un délai pour éviter les conflits avec la validation native VS Code
     */
    static async waitForNativeValidation(document: vscode.TextDocument): Promise<void> {
        // Si le document a des erreurs de syntaxe, attendre que VS Code les traite
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        
        // S'il y a des erreurs de syntaxe JSON natives, attendre un peu
        if (diagnostics.some(d => d.source === undefined || d.source === 'json' || d.source === 'jsonc')) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    /**
     * Vérifie si VS Code est encore en train de traiter le document
     */
    static isVSCodeProcessingDocument(document: vscode.TextDocument): boolean {
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        
        // Si il y a des erreurs de parsing JSON en cours, VS Code traite encore
        return diagnostics.some(d => 
            (d.source === undefined || d.source === 'json' || d.source === 'jsonc') &&
            (d.message.includes('trailing comma') || 
             d.message.includes('Expected') || 
             d.message.includes('Unexpected'))
        );
    }

    /**
     * Crée un document selector optimisé pour éviter les conflits
     */
    static createOptimizedDocumentSelector(): vscode.DocumentSelector {
        return [
            { language: "json", pattern: "**/behavior_pack/**" },
            { language: "json", pattern: "**/behavior_packs/**" },
            { language: "json", pattern: "**/resource_pack/**" },
            { language: "json", pattern: "**/resource_packs/**" },
            { language: "json", pattern: "**/addon/**" },
            { language: "json", pattern: "**/addons/**" },
            { language: "json", pattern: "**/development_behavior_packs/**" },
            { language: "json", pattern: "**/development_resource_packs/**" },
            { language: "jsonc", pattern: "**/behavior_pack/**" },
            { language: "jsonc", pattern: "**/behavior_packs/**" },
            { language: "jsonc", pattern: "**/resource_pack/**" },
            { language: "jsonc", pattern: "**/resource_packs/**" },
            { language: "jsonc", pattern: "**/addon/**" },
            { language: "jsonc", pattern: "**/addons/**" },
            { language: "jsonc", pattern: "**/development_behavior_packs/**" },
            { language: "jsonc", pattern: "**/development_resource_packs/**" }
        ];
    }
}
