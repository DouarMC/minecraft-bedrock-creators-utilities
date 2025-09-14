import * as vscode from 'vscode';
import { ProjectMetadata } from '../../../types/projectConfig';
import { AddonPackageJson } from '../../../types/addonPackageJson';

export function createBasePackageJson(metadata: ProjectMetadata): AddonPackageJson {
    const packageJson: AddonPackageJson = {
        name: metadata.id,
        version: "0.0.1",
        description: `Addon for ${metadata.displayName}`,
        license: "MIT",
        dependencies: {},
        type: "module"
    };

    return packageJson;
}

export async function updatePackageJson(
    projectFolder: vscode.Uri,
    updater: (pkg: AddonPackageJson) => void | Promise<void>,
    metadata?: ProjectMetadata
) {
    const packageJsonUri = vscode.Uri.joinPath(projectFolder, "package.json");

    let packageJson: AddonPackageJson;
    
    try {
        const content = await vscode.workspace.fs.readFile(packageJsonUri);
        packageJson = JSON.parse(content.toString()) as AddonPackageJson;
    } catch (error) {
        if (metadata === undefined) {
            throw new Error("Impossible de créer package.json sans metadata.");
        }
        packageJson = createBasePackageJson(metadata);
    }

    await Promise.resolve(updater(packageJson));

    const content = JSON.stringify(packageJson, null, 4);
    await vscode.workspace.fs.writeFile(packageJsonUri, Buffer.from(content, "utf8"));
}