import * as vscode from "vscode";
import { MinecraftAddonPack, MinecraftProduct, MinecraftProjectType, ProjectMetadata } from "../../types/projectConfig";
import { SCRIPT_API_MODULES, SCRIPT_API_MODULES_NAMES, SCRIPT_API_MODULES_NAMES_PREVIEW, SCRIPT_API_MODULES_PREVIEW } from "../../utils/data/scriptApiModules";
import { ProjectManager } from "../project/ProjectManager";
import { launchMinecraft } from "../system/launchMinecraft";
import { MinecraftProjectConfig } from "../project/MinecraftProjectConfig";

export class PromptService {
    public static readonly PACK_TYPE_ITEMS: vscode.QuickPickItem[] = [
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
     * Affiche une boîte de dialogue pour sélectionner les types de packs d'un addon.
     * @returns 
     */
    public static async askAddonPackTypes(): Promise<MinecraftAddonPack[]> {
        const packAddonItems = await vscode.window.showQuickPick(
            PromptService.PACK_TYPE_ITEMS,
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
     * @returns 
     */
    public static async askProjectMetadata(): Promise<ProjectMetadata | undefined> {
        const selectedProjectTypeItem = await vscode.window.showQuickPick(
            PromptService.PROJECT_TYPE_ITEMS,
            {
                title: "Type du projet",
                placeHolder: "Sélectionnez le type du projet",
                canPickMany: false,
                ignoreFocusOut: true
            }
        );
        if (selectedProjectTypeItem === undefined) return; // L'utilisateur a annulé la sélection

        const id = (await vscode.window.showInputBox({
            title: "ID du projet",
            prompt: "Entrez l'id du projet",
            placeHolder: "mon_pack",
            ignoreFocusOut: true,
            validateInput: (value: string) => {
                const trimmed = value.trim();
                if (!/^[a-z0-9-_]+$/.test(trimmed)) {
                    return "⚠️ L'ID ne peut contenir que des lettres minuscules, des chiffres, des tirets (-) et des underscores (_).";
                }
                if (trimmed.length === 0) {
                    return "⚠️ L'ID ne peut pas être vide.";
                }
                return null;
            }
        }))?.trim().toLowerCase();
        if (id === undefined) return;

        const displayName = (await vscode.window.showInputBox({
            title: "Nom d'affichage du projet",
            prompt: "Entrez le nom d'affichage du projet",
            placeHolder: id,
            ignoreFocusOut: true
        }))?.trim() || id; // fallback à l'id si vide
        if (displayName === undefined) return;

        const author = (await vscode.window.showInputBox({
            title: "Auteur du projet",
            prompt: "Entrez l'auteur du projet",
            placeHolder: "Mon Nom",
            ignoreFocusOut: true
        }))?.trim() || "Unknown Author"; // fallback à "Unknown Author" si vide
        if (author === undefined) return;

        const selectedMinecraftProductItem = await vscode.window.showQuickPick(
            PromptService.MINECRAFT_PRODUCT_ITEMS,
            {
                title: "Produit Minecraft",
                placeHolder: "Sélectionnez le produit Minecraft",
                canPickMany: false,
                ignoreFocusOut: true
            }
        );
        if (selectedMinecraftProductItem === undefined) return;

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
     * @throws {Error} Si aucun projet Minecraft n'est chargé.
     * @returns 
     */
    public static async askScriptApiModules(): Promise<Record<string, string> | undefined> {
        const project = ProjectManager.project;
        if (project === undefined) {
            throw new Error("Aucun projet Minecraft chargé.");
        }

        const minecraftProduct = project.minecraftProduct;

        const moduleNames = minecraftProduct === MinecraftProduct.Stable
            ? SCRIPT_API_MODULES_NAMES
            : SCRIPT_API_MODULES_NAMES_PREVIEW;

        const moduleVersions = minecraftProduct === MinecraftProduct.Stable
            ? SCRIPT_API_MODULES
            : SCRIPT_API_MODULES_PREVIEW;
        
        const selectedModules = await vscode.window.showQuickPick(moduleNames, {
            title: "Modules de l'API Script",
            placeHolder: "Sélectionnez les modules à inclure",
            canPickMany: true
        });

        if (!selectedModules || selectedModules.length === 0) return;

        const selectedWithVersions: Record<string, string> = {};
        for (const module of selectedModules) {
            const versions = moduleVersions[module];
            const version = await vscode.window.showQuickPick(versions, {
                title: `Version du module ${module}`,
                placeHolder: `Sélectionnez la version du module ${module}`
            });

            if (version) {
                selectedWithVersions[module] = version;
            }
        }

        return selectedWithVersions;
    }

    /**
     * Propose à l'utilisateur de lancer Minecraft après un déploiement.
     * @throws {Error} Si aucun projet Minecraft n'est chargé.
     * @returns 
     */
    public static async askToLaunchMinecraft(): Promise<void> {
        const project = ProjectManager.project;
        if (project === undefined) {
            throw new Error("Aucun projet Minecraft chargé.");
        }
        
        if (project.options.deploy.prompt_to_launch_minecraft === false) {
            return; // Le projet a désactivé la proposition
        }

        const productName = project.minecraftProduct === MinecraftProduct.Stable ? "Minecraft" : "Minecraft Preview";
        const action = await vscode.window.showInformationMessage(
            `✅ Déploiement terminé ! Voulez-vous lancer ${productName} ?`,
            {
                title: `🚀 Lancer ${productName}`,
                action: 'launch'
            },
            {
                title: "⚙️ Ne plus demander",
                action: 'disable'
            },
            {
                title: "❌ Non",
                action: 'dismiss'
            }
        );

        switch (action?.action) {
            case "launch":
                await launchMinecraft(project.minecraftProduct);
                break;

            case "disable":
                const configFileUri = await project.getConfigFileUri();
                const fileContent = await vscode.workspace.fs.readFile(configFileUri);
                const config = MinecraftProjectConfig.fromJSON(Buffer.from(fileContent).toString("utf8"));

                config.options = config.options || {};
                config.options.deploy = config.options.deploy || {};
                config.options.deploy.prompt_to_launch_minecraft = false;

                await vscode.workspace.fs.writeFile(
                    configFileUri,
                    Buffer.from(JSON.stringify(config, null, 4), "utf8")
                );

                vscode.window.showInformationMessage("💡 Vous pouvez réactiver cette option en rééditant `.mcbe_project.json`.");
                break;
            case "dismiss":
            default:
                // Ne rien faire
                break;
        }
    }

    /**
     * Affiche une boîte de dialogue pour sélectionner les types de modules du pack de comportement.
     * @returns 
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
}