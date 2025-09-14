import * as vscode from 'vscode';
import { MinecraftProduct, MinecraftProjectConfig } from '../../../types/projectConfig';
import { launchMinecraft } from '../../system/launchMinecraft';
import { MinecraftProject } from '../MinecraftProject';

/**
 * Propose à l'utilisateur de lancer Minecraft après un déploiement réussi
 */
export async function promptToLaunchMinecraft(minecraftProject: MinecraftProject): Promise<void> {
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

            vscode.window.showInformationMessage("💡 Vous pouvez réactiver cette option en rééditant `.mcbe_project.json`.");
            break;
            
        case 'dismiss':
        default:
            // Ne rien faire
            break;
    }
}
