import * as vscode from "vscode";
import { MinecraftAddonPack, MinecraftProduct, MinecraftProjectType, ProjectMetadata } from "../../types/projectConfig";
import { MinecraftProjectManager } from "../project/MinecraftProjectManager";
import { SCHEMA_BASE_URL } from "../../constants";

export interface FolderPickItem extends vscode.QuickPickItem {
    game: "stable" | "preview";
    folderType: "comMojangFolder" | "dataFolder";
}

export class PromptService {
    /**
     * Contient les différents types de pack d'addons.
     */
    public static readonly ADDON_PACK_TYPE_ITEMS: vscode.QuickPickItem[] = [
        {
            label: MinecraftAddonPack.BehaviorPack,
            description: "Pack de comportement.",
            detail: "Contient les comportements, entités, et scripts.",
            alwaysShow: true
        },
        {
            label: MinecraftAddonPack.ResourcePack,
            description: "Pack de ressources.",
            detail: "Contient les textures, sons, et modèles.",
            alwaysShow: true
        }
    ];
    public static readonly PROJECT_TYPE_ITEMS: vscode.QuickPickItem[] = [
        {
            label: MinecraftProjectType.Addon,
            description: "Un addon pour Minecraft Bedrock.",
            detail: "Peut contenir un pack de comportements et/ou un pack de ressources.",
            alwaysShow: true
        },
        {
            label:  MinecraftProjectType.SkinPack,
            description: "Un pack de skins pour Minecraft Bedrock.",
            detail: "Contient des skins personnalisés pour les personnages du jeu.",
            alwaysShow: true
        },
        {
            label: MinecraftProjectType.WorldTemplate,
            description: "Un modèle de monde pour Minecraft Bedrock.",
            detail: "Permet de créer et partager des mondes personnalisés et préconfigurés.",
            alwaysShow: true
        }
    ];
    public static readonly MINECRAFT_PRODUCT_ITEMS: vscode.QuickPickItem[] = [
        {
            label: MinecraftProduct.Stable,
            description: "Version stable de Minecraft.",
            detail: "Recommandé pour la plupart des utilisateurs.",
            alwaysShow: true
        },
        {
            label: MinecraftProduct.Preview,
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
     * Contient les différents dossiers Minecraft que l'utilisateur peut choisir d'ouvrir via la fonctionnalité d'exploration des dossiers Minecraft. Chaque item contient le jeu ciblé (Stable ou Preview) et le type de dossier (com.mojang ou dossier de ressources vanilla) pour permettre d'ouvrir le bon dossier en fonction de la sélection de l'utilisateur.
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

    /**
     * Affiche une boîte de dialogue pour sélectionner les types de packs d'un addon à créer.
     * @returns 
     */
    public static async askAddonPackTypes(): Promise<MinecraftAddonPack[]> {
        const packAddonItems = await vscode.window.showQuickPick(
            PromptService.ADDON_PACK_TYPE_ITEMS,
            {
                title: "Types de packs de l'addon",
                placeHolder: "Sélectionnez le/les types de packs pour l'addon",
                canPickMany: true,
                ignoreFocusOut: true
            }
        );

        return packAddonItems?.map(item => item.label as MinecraftAddonPack) ?? [];
    }

    /**
     * Affiche une série de boîtes de dialogue pour récupérer les métadonnées du projet.
     * @returns Renvoie un objet contenant les métadonnées du projet ou undefined si l'utilisateur a annulé la saisie.
     */
    public static async askProjectMetadata(): Promise<ProjectMetadata | undefined> {
        // Selection du type de projet (Addon, Skin Pack, World Template)
        const selectedProjectTypeItem = await vscode.window.showQuickPick(
            PromptService.PROJECT_TYPE_ITEMS,
            {
                title: "Type du projet",
                placeHolder: "Sélectionnez le type du projet",
                canPickMany: false,
                ignoreFocusOut: true
            }
        );
        // Si l'utilisateur annule la sélection, on retourne undefined pour indiquer que l'opération a été annulée
        if (selectedProjectTypeItem === undefined) {
            return;
        }

        // Demande de l'ID du projet avec validation pour n'accepter que les caractères valides (lettres minuscules, chiffres, tirets, underscores)
        // Anlève les espaces inutiles et convertit en minuscules pour éviter les erreurs de format
        const id = (await vscode.window.showInputBox({
            title: "ID du projet",
            prompt: "Entrez l'id du projet",
            placeHolder: "mon_pack",
            ignoreFocusOut: true,
            validateInput: (value: string) => {
                const trimmed = value.trim(); // Enlève les espaces inutiles
                if (!/^[a-z0-9-_]+$/.test(trimmed)) { // Vérifie que l'ID ne contient que des caractères valides
                    return "⚠️ L'ID ne peut contenir que des lettres minuscules, des chiffres, des tirets (-) et des underscores (_).";
                }
                if (trimmed.length === 0) { // Vérifie que l'ID n'est pas vide après avoir enlevé les espaces
                    return "⚠️ L'ID ne peut pas être vide.";
                }
                return undefined; // Retourne undefined si l'ID est valide
            }
        }))?.trim().toLowerCase();
        // Si l'utilisateur annule la saisie ou si l'ID est vide après validation, on retourne undefined pour indiquer que l'opération a été annulée
        if (id === undefined) {
            return;
        }

        // Demande du nom d'affichage du projet (optionnel, fallback à l'ID si vide)
        const displayName = (await vscode.window.showInputBox({
            title: "Nom d'affichage du projet",
            prompt: "Entrez le nom d'affichage du projet",
            placeHolder: id,
            ignoreFocusOut: true
        }))?.trim() || id; // fallback à l'id si vide

        // Demande de l'auteur du projet (optionnel, fallback à "Unknown Author" si vide)
        const author = (await vscode.window.showInputBox({
            title: "Auteur du projet",
            prompt: "Entrez l'auteur du projet",
            placeHolder: "Mon Nom",
            ignoreFocusOut: true
        }))?.trim() || "Unknown Author"; // fallback à "Unknown Author" si vide

        // Selection du produit Minecraft ciblé (Stable ou Preview)
        const selectedMinecraftProductItem = await vscode.window.showQuickPick(
            PromptService.MINECRAFT_PRODUCT_ITEMS,
            {
                title: "Produit Minecraft",
                placeHolder: "Sélectionnez le produit Minecraft",
                canPickMany: false,
                ignoreFocusOut: true
            }
        );
        // Si l'utilisateur annule la sélection, on retourne undefined pour indiquer que l'opération a été annulée
        if (selectedMinecraftProductItem === undefined) {
            return;
        }

        return {
            type: selectedProjectTypeItem.label as MinecraftProjectType,
            id: id,
            displayName: displayName,
            author: author,
            minecraftProduct: selectedMinecraftProductItem.label as MinecraftProduct
        };
    }

    /**
     * Demande à l'utilisateur les modules de l'API Script à inclure et leurs versions.
     * @throws {Error} Si aucun projet Minecraft n'est chargé, ou si la récupération des modules de l'API Script depuis le serveur échoue, ou si la création de la structure de l'API Script dans le projet échoue.
     * @returns 
     */
    public static async askScriptApiModules(): Promise<Record<string, { version: string, npmVersion: string }> | undefined> {
        // Récupère le projet Minecraft actuellement chargé pour connaître le produit Minecraft ciblé (Stable ou Preview), nécessaire pour filtrer les versions des modules de l'API Script à proposer à l'utilisateur
        const project = MinecraftProjectManager.project;
        if (project === undefined) {
            throw new Error("Aucun projet Minecraft chargé.");
        }

        const minecraftProduct = project.minecraftProduct; // On récupère le produit Minecraft ciblé (Stable ou Preview) à partir du projet chargé

        let minecraftScriptApiModules: Response;
        try { // Tente de récupérer les modules de l'API Script depuis le repo github de mon projet
            minecraftScriptApiModules = await fetch(SCHEMA_BASE_URL + "minecraftScriptApiModules/stable.json");
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la récupération des modules de l'API Script depuis le serveur : ${error.message}`);
            }

            throw error;
        }

        if (! minecraftScriptApiModules.ok) { // Si la réponse du serveur n'est pas OK (ex: 404, 500, etc.), on considère que la récupération a échoué et on affiche une erreur à l'utilisateur
            throw new Error("Impossible de récupérer les modules de l'API Script depuis le serveur.");
        }

        const minecraftScriptApiModulesData = await minecraftScriptApiModules.json() as Record<string, any>; // On parse la réponse JSON
        const moduleNames = Object.keys(minecraftScriptApiModulesData); // On récupère les noms des modules de l'API Script à partir de la réponse

        if (moduleNames.length === 0) { // Si aucun module n'est trouvé dans la réponse, on affiche une erreur à l'utilisateur
            throw new Error("Aucun module de l'API Script trouvé sur le serveur.");
        }
        
        // Affiche une boîte de dialogue pour sélectionner les modules de l'API Script à inclure
        const selectedModules = await vscode.window.showQuickPick(moduleNames, {
            title: "Modules de l'API Script",
            placeHolder: "Sélectionnez les modules à inclure",
            canPickMany: true
        });

        if (!selectedModules || selectedModules.length === 0) { // Si l'utilisateur n'a sélectionné aucun module, on considère que l'opération a été annulée et on retourne undefined
            return;
        }

        const selectedWithVersions: Record<string, { version: string, npmVersion: string }> = {}; // On prépare un objet pour stocker les modules sélectionnés avec leurs versions correspondantes
        for (const module of selectedModules) { // Pour chaque module sélectionné
            const versions: string[] = []; // Tableau qui va contenir les versions disponibles pour le module sélectionné, à afficher dans la boîte de dialogue de sélection de version. On va ajouter les versions dans cet ordre : stables (de la plus récente à la plus ancienne), puis si le produit Minecraft ciblé est Stable on ajoute la Beta Stable, sinon on ajoute la Release Candidate Preview et la Beta Preview (de la plus récente à la plus ancienne)
            const versionMap: Record<string, string> = {}; // Objet qui va faire le lien entre les versions affichées à l'utilisateur (clés) et les versions npm correspondantes (valeurs), nécessaire pour ensuite ajouter la bonne version npm dans le package.json du projet en fonction de la version sélectionnée par l'utilisateur

            const moduleVersionInfos = minecraftScriptApiModulesData[module]; // On récupère les informations de version pour le module sélectionné à partir de la réponse du serveur
            if (Array.isArray(moduleVersionInfos.stable_versions)) { // Si des versions stables sont disponibles pour le module sélectionné
                // On fait une copie (.slice) pour ne pas modifier l'original, puis reverse
                const stableVersions = moduleVersionInfos.stable_versions.slice().reverse();
                versions.push(...stableVersions); // On ajoute les versions stables à la liste des versions à afficher
                for (const v of stableVersions) { // On ajoute les versions stables dans le versionMap pour faire le lien entre la version affichée et la version npm correspondante
                    versionMap[v] = v;
                }
            }

            if (minecraftProduct === MinecraftProduct.Stable) { // Si le projet cible la version Stable de Minecraft
                // On ajoutee la Beta Stable (Si elle existe)
                if (moduleVersionInfos.last_beta_version_stable) {
                    for (const [v, npmV] of Object.entries(moduleVersionInfos.last_beta_version_stable)) {
                        versions.unshift(v);
                        versionMap[v] = npmV as string;
                    }
                }
            } else { // Si le projet cible la version Preview de Minecraft
                // On ajoute la Release Candidate Preview (Si elle existe)
                if (moduleVersionInfos.last_release_candidate_version_preview) {
                    for (const [v, npmV] of Object.entries(moduleVersionInfos.last_release_candidate_version_preview)) {
                        versions.unshift(v);
                        versionMap[v] = npmV as string;
                    }
                }

                // // On ajoute la Beta Preview (Si elle existe)
                if (moduleVersionInfos.last_beta_version_preview) {
                    for (const [v, npmV] of Object.entries(moduleVersionInfos.last_beta_version_preview)) {
                        versions.unshift(v);
                        versionMap[v] = npmV as string;
                    }
                }
            }

            // Si aucune version n'est disponible pour le module sélectionné, on affiche un message d'avertissement et on passe au module suivant
            if (versions.length === 0) {
                vscode.window.showWarningMessage(`Aucune version trouvée pour le module ${module}`);
                continue;
            }

            // Affiche une boîte de dialogue pour sélectionner la version du module sélectionné à inclure
            const version = await vscode.window.showQuickPick(versions, {
                title: `Version du module ${module}`,
                placeHolder: `Sélectionnez la version du module ${module}`,
                ignoreFocusOut: true
            });

            if (version) { // Si l'utilisateur a sélectionné une version, on l'ajoute à la liste des modules sélectionnés avec la version correspondante
                selectedWithVersions[module] = {
                    version: version,
                    npmVersion: versionMap[version]
                };
            }
        }

        return selectedWithVersions;
    }

    /**
     * Affiche une boîte de dialogue pour sélectionner les types de modules du pack de comportement.
     * @returns Un tableau contenant les types de modules sélectionnés ("data" et/ou "script"). Si aucun module n'est sélectionné, retourne un tableau vide.
     */
    public static async askBehaviorPackModuleTypes(): Promise<("data" | "script")[]> {
        const selectedModuleItems = await vscode.window.showQuickPick(
            PromptService.BEHAVIOR_PACK_MODULE_TYPES,
            {
                title: "Modules du pack de comportement",
                placeHolder: "Sélectionnez les modules à inclure dans le pack de comportement",
                canPickMany: true,
                ignoreFocusOut: true
            }
        );

        const selectedModules = selectedModuleItems?.map(item => item.label as "data" | "script") ?? [];
        return selectedModules;
    }

    /**
     * Affiche une boîte de dialogue pour sélectionner un dossier Minecraft à ouvrir.
     * @returns 
     */
    public static async askMinecraftFolderToOpen(): Promise<FolderPickItem | undefined> {
        const selectedFolderItem = await vscode.window.showQuickPick(
            PromptService.MINECRAFT_FOLDERS_TO_OPEN,
            {
                title: "Ouvrir un dossier Minecraft",
                placeHolder: "Sélectionnez le dossier Minecraft à ouvrir",
                canPickMany: false,
                ignoreFocusOut: true
            }
        );

        return selectedFolderItem;
    }
}