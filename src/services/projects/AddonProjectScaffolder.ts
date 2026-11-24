import * as vscode from 'vscode';
import { AddonStructureOptions } from '../../types/addonProjectSetup';
import { ProjectMetadata } from '../../types/projectConfig';
import { AddonProjectScaffoldWriter } from './AddonProjectScaffoldWriter';
import { ScriptApiService } from './ScriptApiService';
import { VscodeUtils } from '../../vscode-utils/VscodeUtils';

export class AddonProjectScaffolder {
    public static async create(
        projectFolder: vscode.Uri,
        metadata: ProjectMetadata,
        options: AddonStructureOptions
    ): Promise<void> {
        await AddonProjectScaffoldWriter.create(projectFolder, metadata, options, {
            joinPath: vscode.Uri.joinPath,
            createDirectory: async (uri) => {
                await vscode.workspace.fs.createDirectory(uri);
            },
            isFileExistsError: (error) => error instanceof vscode.FileSystemError && error.code === 'FileExists',
            copyDefaultPackIcon: async (packFolder) => {
                const extensionContext = VscodeUtils.getContext();
                const iconSource = vscode.Uri.joinPath(extensionContext.extensionUri, 'assets', 'icons', 'default_pack_icon.png');
                const iconTarget = vscode.Uri.joinPath(packFolder, 'pack_icon.png');
                await vscode.workspace.fs.copy(iconSource, iconTarget);
            },
            writeFile: async (uri, content) => {
                await VscodeUtils.writeFile(uri, content);
            },
            createScriptApiStructure: async (uri) => {
                await ScriptApiService.createScriptApiStructure(uri);
            },
            installNpmDependencies: async (uri) => {
                await ScriptApiService.installNpmDependencies(uri);
            }
        });
    }
}
