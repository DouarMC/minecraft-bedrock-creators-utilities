import * as vscode from 'vscode';
import { ProjectMetadata, MinecraftProjectType, MinecraftProduct } from '../../../types/projectConfig';

const PROJECT_TYPE_ITEMS: vscode.QuickPickItem[] = [
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

const MINECRAFT_PRODUCT_ITEMS: vscode.QuickPickItem[] = [
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
 * Affiche une série de boîtes de dialogue pour recueillir les métadonnées du projet Minecraft Bedrock auprès de l'utilisateur.
 * @returns 
 */
export async function promptProjectMetadata(): Promise<ProjectMetadata | undefined> {
    const selectedProjectTypeItem = await vscode.window.showQuickPick(
        PROJECT_TYPE_ITEMS,
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
    if (!id) return;

    const displayName = (await vscode.window.showInputBox({
        title: "Nom d'affichage du projet",
        prompt: "Entrez le nom d'affichage du projet",
        placeHolder: id,
        ignoreFocusOut: true
    }))?.trim() || id; // fallback à l'id si vide
    if (!displayName) return;

    const author = (await vscode.window.showInputBox({
        title: "Auteur du projet",
        prompt: "Entrez l'auteur du projet",
        placeHolder: "Mon Nom",
        ignoreFocusOut: true
    }))?.trim() || "Unknown Author"; // fallback à "Unknown Author" si vide
    if (!author) return;

    const selectedMinecraftProductItem = await vscode.window.showQuickPick(
        MINECRAFT_PRODUCT_ITEMS,
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