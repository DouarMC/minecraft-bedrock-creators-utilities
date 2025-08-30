import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { MinecraftProduct, MinecraftProjectConfig } from '../../../types/projectConfig';
import { globals } from '../../../globals';

/**
 * Fonction pour lancer Minecraft selon le produit (stable ou preview)
 */
export async function launchMinecraft(minecraftProduct: MinecraftProduct): Promise<boolean> {
    try {
        const execPromise = promisify(exec);
        
        // URI de lancement pour les applications UWP de Minecraft
        const launchUri = minecraftProduct === MinecraftProduct.Stable
            ? "minecraft://" 
            : "minecraft-preview://";
            
        // Commande PowerShell pour lancer l'application UWP
        const command = `powershell -Command "Start-Process '${launchUri}'"`;
        
        await execPromise(command);
        
        vscode.window.showInformationMessage(`🎮 Minecraft ${minecraftProduct === MinecraftProduct.Stable ? "Stable" : "Preview"} en cours de lancement...`);
        return true;
        
    } catch (error) {
        console.error("Erreur lors du lancement de Minecraft :", error);
        vscode.window.showErrorMessage(`❌ Impossible de lancer Minecraft ${minecraftProduct}. Vérifiez qu'il est installé.`);
        return false;
    }
}

/**
 * Propose à l'utilisateur de lancer Minecraft après un déploiement réussi
 */
export async function promptToLaunchMinecraft(): Promise<void> {
    const minecraftProject = globals.currentMinecraftProject;
    if (minecraftProject === undefined) return;

    if (minecraftProject.options.deploy.prompt_to_launch_minecraft === false) {
        return; // Le projet a désactivé la proposition
    }
    
    const productName = minecraftProject.minecraftProduct === MinecraftProduct.Stable ? "Minecraft" : "Minecraft Preview";
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
        case 'launch':
            await launchMinecraft(minecraftProject.minecraftProduct);
            break;
            
        case 'disable':
            const configFileUri = minecraftProject.configFileUri;
            const fileContent = await vscode.workspace.fs.readFile(configFileUri);
            const config = JSON.parse(Buffer.from(fileContent).toString("utf8")) as MinecraftProjectConfig;
            
            config.options = config.options || {};
            config.options.deploy = config.options.deploy || {};
            config.options.deploy.prompt_to_launch_minecraft = false;

            await vscode.workspace.fs.writeFile(
                configFileUri, 
                Buffer.from(JSON.stringify(config, null, 4), "utf8")
            );

            vscode.window.showInformationMessage("💡 Vous pouvez réactiver cette option dans les paramètres du projet (.vscode/settings.json).");
            break;
            
        case 'dismiss':
        default:
            // Ne rien faire
            break;
    }
}
