import * as vscode from 'vscode';
import { parseEnvValue } from '../../utils/envUtils';

/**
 * Enregistre la commande de validation du projet dans l'extension.
 * @param context Le contexte de l'extension.
 */
export function registerValidateProjectCommand(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.validateProject", async () => {
        // Message pour indiquer que la validation du projet a commencé
        vscode.window.showInformationMessage("✅ Validation du projet démarrée...");

        // Récupération des dossiers de travail ouverts
        const workspaceFolders = vscode.workspace.workspaceFolders;
        // Vérification si des dossiers de travail sont ouverts
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showWarningMessage("Aucun dossier ouvert dans l'espace de travail.");
            return;
        }

        // Récupération du premier dossier de travail
        const projectRoot = workspaceFolders[0].uri;
        // Récupération du fichier .env
        const envFile = vscode.Uri.joinPath(projectRoot, ".env");
        try {
            // Lecture du contenu du fichier .env
            const envContent = await vscode.workspace.fs.readFile(envFile);
            const envString = Buffer.from(envContent).toString('utf8');
            // Extraction de la valeur de la variable PROJECT_TYPE
            const projectType = parseEnvValue(envString, 'PROJECT_TYPE');
            // Vérification si la variable PROJECT_TYPE est définie
            if (!projectType) {
                vscode.window.showWarningMessage("⚠️ La variable PROJECT_TYPE n'est pas définie dans le fichier .env.");
                return;
            }
            // Vérification si le type de projet est valide
            if (!["addon", "skin_pack", "world_template"].includes(projectType)) {
                vscode.window.showWarningMessage(`⚠️ Type de projet inconnu : ${projectType}. Veuillez vérifier la variable PROJECT_TYPE dans le fichier .env.`);
                return;
            }

            // Extraction de la valeur de la variable PROJECT_ID
            const projectId = parseEnvValue(envString, 'PROJECT_ID');
            // Vérification si la variable PROJECT_ID est définie
            if (!projectId) {
                vscode.window.showWarningMessage("⚠️ La variable PROJECT_ID n'est pas définie dans le fichier .env.");
                return;
            }
            // Vérification si le format de PROJECT_ID est valide
            const projectIdRegex = /^[a-z0-9_]+$/;
            if (!projectIdRegex.test(projectId)) {
                vscode.window.showWarningMessage(`⚠️ Format de PROJECT_ID invalide : ${projectId}. Veuillez utiliser uniquement des lettres minuscules, des chiffres et des underscores.`);
                return;
            }

            // Extraction de la valeur de la variable PROJECT_MINECRAFT_PRODUCT
            const projectMinecraftProduct = parseEnvValue(envString, 'PROJECT_MINECRAFT_PRODUCT');
            // Vérification si la variable PROJECT_MINECRAFT_PRODUCT est définie
            if (!projectMinecraftProduct) {
                vscode.window.showWarningMessage("⚠️ La variable PROJECT_MINECRAFT_PRODUCT n'est pas définie dans le fichier .env.");
                return;
            }
            // Vérification si le produit Minecraft est valide
            const validMinecraftProducts = ["stable", "preview"];
            if (!validMinecraftProducts.includes(projectMinecraftProduct)) {
                vscode.window.showWarningMessage(`⚠️ Produit Minecraft inconnu : ${projectMinecraftProduct}. Veuillez vérifier la variable PROJECT_MINECRAFT_PRODUCT dans le fichier .env.`);
                return;
            }

            // Si tout est valide, afficher un message de succès
            vscode.window.showInformationMessage("✅ Validation du projet réussie !");
        } catch (error) {
            vscode.window.showErrorMessage("❌ Fichier .env introuvable ou illisible.");
            console.error(error);
        }
    });

    context.subscriptions.push(command);
}