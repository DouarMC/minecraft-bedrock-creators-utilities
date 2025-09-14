import * as vscode from 'vscode';
import { MinecraftProjectConfig } from '../../../types/projectConfig';
import { ProjectMetadata } from '../../../types/projectConfig';

export async function createMinecraftProjectFile(folder: vscode.Uri, metadata: ProjectMetadata): Promise<void> {
    const mcbeProjectContent: MinecraftProjectConfig = {
        metadata: metadata,
        options: {
            deploy: {
                prompt_to_launch_minecraft: true
            }
        }
    };

    await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(folder, ".mcbe_project.json"),
        Buffer.from(JSON.stringify(mcbeProjectContent, null, 4), "utf8")
    );
}