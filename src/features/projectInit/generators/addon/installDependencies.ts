import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";

export async function installDependencies(projectFolder: vscode.Uri): Promise<void> {
    const execPromise = promisify(exec);
    try {
        await execPromise("npm -v"); // vérifie npm
        const { stderr } = await execPromise("npm install", { cwd: projectFolder.fsPath });
        if (stderr) console.error(stderr);
        
        vscode.window.showInformationMessage("📦 Modules npm installés !");
    } catch (error: any) {
        const isNpmNotFound = error?.message?.includes("npm") || error?.code === "ENOENT";
        if (isNpmNotFound) {
            vscode.window.showErrorMessage(
                "❌ Node.js (et npm) est requis pour initialiser les dépendances. Installez-le depuis https://nodejs.org/"
            );
        } else {
            console.error("npm install failed:", error);
            vscode.window.showErrorMessage("❌ npm install a échoué.");
        }
    }
}