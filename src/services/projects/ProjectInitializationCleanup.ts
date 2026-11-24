import * as vscode from 'vscode';

const GENERATED_PROJECT_ENTRIES = [
    '.vscode',
    '.mcbe_project.json',
    'addon',
    'package.json',
    'package-lock.json',
    'node_modules'
];

export class ProjectInitializationCleanup {
    public static async removeGeneratedEntries(projectFolder: vscode.Uri): Promise<void> {
        const failures: string[] = [];

        for (const entry of GENERATED_PROJECT_ENTRIES) {
            try {
                await vscode.workspace.fs.delete(vscode.Uri.joinPath(projectFolder, entry), {
                    recursive: true,
                    useTrash: false
                });
            } catch (error) {
                if (error instanceof vscode.FileSystemError && error.code === 'FileNotFound') {
                    continue;
                }

                failures.push(`${entry}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        if (failures.length > 0) {
            throw new Error(`Nettoyage incomplet du dossier du projet (${failures.join('; ')})`);
        }
    }
}
