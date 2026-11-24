import * as vscode from 'vscode';
import { VscodeUtils } from '../../vscode-utils/VscodeUtils';

export class ProjectTemplateService {
    public static async copyTemplateFile(templateRelativePath: string, destination: vscode.Uri): Promise<void> {
        const extensionContext = VscodeUtils.getContext();
        const templateUri = vscode.Uri.joinPath(extensionContext.extensionUri, 'assets', 'templates', templateRelativePath);

        try {
            if (!await VscodeUtils.pathExists(templateUri)) {
                throw new Error(`Le fichier modèle '${templateRelativePath}' est introuvable dans l'extension.`);
            }
        } catch (error) {
            throw error;
        }

        try {
            await vscode.workspace.fs.copy(templateUri, destination, { overwrite: true });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la copie du fichier modèle '${templateRelativePath}' : ${error.message}`);
            }

            throw error;
        }
    }
}
