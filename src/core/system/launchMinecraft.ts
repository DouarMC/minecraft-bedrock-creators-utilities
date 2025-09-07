import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";
import { MinecraftProduct } from "../../types/projectConfig";

function getLaunchCommand(launchUri: string): string | undefined {
    switch (process.platform) {
        case "win32":
            return `powershell -Command "Start-Process '${launchUri}'"`;
        case "darwin":
            return `open "${launchUri}"`;
        case "linux":
            return `xdg-open "${launchUri}"`;
        default:
            return undefined;
    }
}

/**
 * Lance Minecraft (Stable ou Preview) en utilisant l’URI UWP
 */
export async function launchMinecraft(minecraftProduct: MinecraftProduct): Promise<boolean> {
    const execPromise = promisify(exec);

    const launchUri = minecraftProduct === MinecraftProduct.Stable ? "minecraft://" : "minecraft-preview://";
    const command = getLaunchCommand(launchUri);

    if (!command) {
        vscode.window.showErrorMessage(
            `⚠️ Plateforme non prise en charge (${process.platform}).`
        );
        return false;
    }

    try {
        await execPromise(command);
        vscode.window.showInformationMessage(
            `🎮 Minecraft ${minecraftProduct === MinecraftProduct.Stable ? "Stable" : "Preview"} en cours de lancement...`
        );
        return true;
    } catch (error) {
        console.error("Erreur lors du lancement de Minecraft :", error);
        vscode.window.showErrorMessage(
            `❌ Impossible de lancer Minecraft ${minecraftProduct}. Vérifiez qu'il est installé.`
        );
        return false;
    }
}