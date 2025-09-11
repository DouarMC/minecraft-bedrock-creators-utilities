import * as vscode from "vscode";
import { MinecraftProject } from "../MinecraftProject";
import { promisify } from "util";
import { exec } from "child_process";
import { directoryExists } from "../../filesystem/directories";

async function compilationNeeded(minecraftProject: MinecraftProject): Promise<boolean> {
    if (minecraftProject.scriptsFolder === undefined) {
        return false;
    }

    const hasScripts = await directoryExists(minecraftProject.scriptsFolder);
    return hasScripts;
}

export async function compileTypeScript(minecraftProject: MinecraftProject): Promise<boolean> {
    if (await compilationNeeded(minecraftProject) === false) {
        return true;
    }

    try {
        const execPromise = promisify(exec);
        const { stdout, stderr } = await execPromise(`tsc`, {cwd: minecraftProject.folder.fsPath});

        if (stderr) {
            console.error(stderr);
            vscode.window.showErrorMessage("Erreur lors de la compilation TypeScript : " + stderr);
            return false;
        }
    } catch (error) {
        console.error("Erreur lors de l'exécution de tsc :", error);
        vscode.window.showErrorMessage("Erreur lors de l'exécution de tsc. Veuillez vérifier la console pour plus de détails.");
        return false;
    }

    return true;
}