import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

/**
 * Fonction pour lancer Minecraft selon le produit (stable ou preview)
 */
export async function launchMinecraft(minecraftProduct: "stable" | "preview"): Promise<boolean> {
    try {
        const execPromise = promisify(exec);
        
        // URI de lancement pour les applications UWP de Minecraft
        const launchUri = minecraftProduct === "stable" 
            ? "minecraft://" 
            : "minecraft-preview://";
            
        // Commande PowerShell pour lancer l'application UWP
        const command = `powershell -Command "Start-Process '${launchUri}'"`;
        
        console.log(`🚀 Lancement de Minecraft ${minecraftProduct}...`);
        await execPromise(command);
        
        vscode.window.showInformationMessage(`🎮 Minecraft ${minecraftProduct === "stable" ? "Stable" : "Preview"} en cours de lancement...`);
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
export async function promptToLaunchMinecraft(minecraftProduct: "stable" | "preview"): Promise<void> {
    const config = vscode.workspace.getConfiguration('minecraftBedrockUtilities');
    const autoPrompt = config.get<boolean>('deployProject.promptToLaunchMinecraft', true);
    
    if (!autoPrompt) {
        return; // L'utilisateur a désactivé la proposition
    }
    
    const productName = minecraftProduct === "stable" ? "Minecraft" : "Minecraft Preview";
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
            await launchMinecraft(minecraftProduct);
            break;
            
        case 'disable':
            await config.update('deployProject.promptToLaunchMinecraft', false, vscode.ConfigurationTarget.Workspace);
            vscode.window.showInformationMessage("💡 Vous pouvez réactiver cette option dans les paramètres du projet (.vscode/settings.json).");
            break;
            
        case 'dismiss':
        default:
            // Ne rien faire
            break;
    }
}
