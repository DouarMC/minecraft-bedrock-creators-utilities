import * as vscode from "vscode";

/**
 * Interface représentant un élément de sélection de dossier Minecraft dans une liste de sélection rapide (Quick Pick) de VSCode.
 */
export interface FolderPickItem extends vscode.QuickPickItem {
    game: "stable" | "preview";
    folderType: "comMojangFolder" | "dataFolder";
}

/**
 * Classe contenant les différents éléments de sélection rapide (Quick Pick) utilisés dans les prompts de l'extension.
 */
export class PromptItems {
    /**
     * Contient les différents types de pack d'addons.
     */
    public static readonly ADDON_PACK_TYPE_ITEMS: vscode.QuickPickItem[] = [
        {
            label: "behavior_pack",
            description: "Pack de comportement.",
            detail: "Contient les comportements, entités, et scripts.",
            alwaysShow: true
        },
        {
            label: "resource_pack",
            description: "Pack de ressources.",
            detail: "Contient les textures, sons, et modèles.",
            alwaysShow: true
        }
    ];
    public static readonly PROJECT_TYPE_ITEMS: vscode.QuickPickItem[] = [
        {
            label: "addon",
            description: "Un addon pour Minecraft Bedrock.",
            detail: "Peut contenir un pack de comportements et/ou un pack de ressources.",
            alwaysShow: true
        },
        {
            label: "skin_pack",
            description: "Un pack de skins pour Minecraft Bedrock.",
            detail: "Contient des skins personnalisés pour les personnages du jeu.",
            alwaysShow: true
        },
        {
            label: "world_template",
            description: "Un modèle de monde pour Minecraft Bedrock.",
            detail: "Permet de créer et partager des mondes personnalisés et préconfigurés.",
            alwaysShow: true
        }
    ];
    public static readonly MINECRAFT_PRODUCT_ITEMS: vscode.QuickPickItem[] = [
        {
            label: "stable",
            description: "Version stable de Minecraft.",
            detail: "Recommandé pour la plupart des utilisateurs.",
            alwaysShow: true
        },
        {
            label: "preview",
            description: "Version preview (beta) de Minecraft.",
            detail: "Contient les dernières fonctionnalités, mais peut être instable.",
            alwaysShow: true
        }
    ];

    /**
     * Contient les différents types de modules du pack de comportement.
     */
    public static readonly BEHAVIOR_PACK_MODULE_TYPES: vscode.QuickPickItem[] = [
        {
            label: "data",
            description: "Module principal d'un behavior pack.",
            detail: "Contient les fichiers data-driven (entités, blocs, loot tables, recettes, etc.) qui définissent le comportement du jeu.",
            alwaysShow: true
        },
        {
            label: "script",
            description: "Module de scripts pour un behavior pack.",
            detail: "Permet d'exécuter du code via l'API Script de Minecraft pour créer des comportements dynamiques, réagir aux événements et modifier le monde en temps réel.",
            alwaysShow: true
        }
    ];

    /**
     * Contient les différents dossiers Minecraft que l'utilisateur peut choisir d'ouvrir via la fonctionnalité d'exploration des dossiers Minecraft.
     */
    public static readonly MINECRAFT_FOLDERS_TO_OPEN: FolderPickItem[] = [
        {
            game: "stable",
            folderType: "comMojangFolder",
            label: "Dossier com.mojang de Minecraft Stable",
            description: "Ouvre le dossier com.mojang contenant les packs et mondes de Minecraft Stable.",
            alwaysShow: true
        },
        {
            game: "stable",
            folderType: "dataFolder",
            label: "Dossier de ressources vanilla de Minecraft Stable",
            description: "Ouvre le dossier des ressources vanilla de Minecraft Stable.",
            alwaysShow: true
        },
        {
            game: "preview",
            folderType: "comMojangFolder",
            label: "Dossier com.mojang de Minecraft Preview",
            description: "Ouvre le dossier com.mojang contenant les packs et mondes de Minecraft Preview.",
            alwaysShow: true
        },
        {
            game: "preview",
            folderType: "dataFolder",
            label: "Dossier de ressources vanilla de Minecraft Preview",
            description: "Ouvre le dossier des ressources vanilla de Minecraft Preview.",
            alwaysShow: true
        }
    ];
}