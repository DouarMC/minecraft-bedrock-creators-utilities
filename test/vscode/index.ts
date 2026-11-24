import assert from 'node:assert/strict';
import { chmod, mkdtemp, mkdir, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { AddonMinecraftProject } from '../../src/core/minecraft/models/projects/AddonMinecraftProject';
import { MinecraftProjectConfig } from '../../src/core/minecraft/models/projects/MinecraftProjectConfig';
import { MinecraftStableGame } from '../../src/core/minecraft/models/games/MinecraftStableGame';
import { AddonProjectScaffolder } from '../../src/services/projects/AddonProjectScaffolder';
import { MinecraftProjectManager } from '../../src/services/projects/MinecraftProjectManager';
import { ProjectDeployer } from '../../src/services/projects/ProjectDeployer';
import { ProjectExporter } from '../../src/services/projects/ProjectExporter';
import { ProjectInitializationCleanup } from '../../src/services/projects/ProjectInitializationCleanup';
import { ProjectOutputPreparer } from '../../src/services/projects/ProjectOutputPreparer';
import { ScriptApiService } from '../../src/services/projects/ScriptApiService';
import { SchemaFetcher } from '../../src/core/network/SchemaFetcher';
import { MinecraftGameManager } from '../../src/services/minecraft/MinecraftGameManager';
import { PromptService } from '../../src/services/prompts/PromptService';
import { AddonStructureOptions } from '../../src/types/addonProjectSetup';
import { ProjectMetadata } from '../../src/types/projectConfig';
import { VscodeUtils } from '../../src/vscode-utils/VscodeUtils';

const metadata: ProjectMetadata = {
    type: 'addon',
    id: 'integration-addon',
    displayName: 'Integration Add-on',
    author: 'Integration Test',
    minecraftProduct: 'stable'
};

async function linkLocalTypeScript(projectPath: string): Promise<void> {
    const localTypeScriptPath = path.join(projectPath, 'node_modules', 'typescript');
    await mkdir(path.dirname(localTypeScriptPath), { recursive: true });
    await symlink(
        path.join(VscodeUtils.getContext().extensionPath, 'node_modules', 'typescript'),
        localTypeScriptPath,
        process.platform === 'win32' ? 'junction' : 'dir'
    );
}

async function withProcessPath<T>(newPath: string, operation: () => Promise<T>): Promise<T> {
    const originalPath = process.env.PATH;
    process.env.PATH = newPath;

    try {
        return await operation();
    } finally {
        if (originalPath === undefined) {
            delete process.env.PATH;
        } else {
            process.env.PATH = originalPath;
        }
    }
}

async function withoutGlobalTypeScript<T>(projectPath: string, operation: () => Promise<T>): Promise<T> {
    const emptyPath = path.join(projectPath, 'path-without-global-typescript');
    await mkdir(emptyPath);
    return withProcessPath(emptyPath, operation);
}

function quoteShellArgument(value: string): string {
    return `'${value.replace(/'/g, "'\\''")}'`;
}

async function readJson(uri: vscode.Uri): Promise<any> {
    const content = await vscode.workspace.fs.readFile(uri);
    return JSON.parse(Buffer.from(content).toString('utf8'));
}

async function verifyProjectExport(): Promise<void> {
    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-export-'));
    try {
        const behaviorPackPath = path.join(projectPath, 'addon', 'behavior_pack');
        await mkdir(behaviorPackPath, { recursive: true });
        await writeFile(path.join(behaviorPackPath, 'sample.txt'), 'archive content', 'utf8');

        const projectConfig = new MinecraftProjectConfig({
            metadata,
            options: { deploy: { prompt_to_launch_minecraft: true } }
        });
        const project = new AddonMinecraftProject(projectPath, projectConfig);

        await ProjectExporter.exportProject(project);

        const contents = JSON.parse(await readFile(path.join(behaviorPackPath, 'contents.json'), 'utf8'));
        const mcpackPath = path.join(projectPath, 'export', `${metadata.id}_bp.mcpack`);
        const mcaddonPath = path.join(projectPath, 'export', `${metadata.id}.mcaddon`);

        assert.deepEqual(contents, {});
        assert.ok((await stat(mcpackPath)).size > 0);
        assert.ok((await stat(mcaddonPath)).size > 0);
    } finally {
        await rm(projectPath, { recursive: true, force: true });
    }
}

async function verifyProjectDeployment(): Promise<void> {
    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-deploy-project-'));
    const deployPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-deploy-target-'));
    const originalGetStableGame = MinecraftGameManager.getStableGame;
    const originalGetComMojangFolder = MinecraftGameManager.getComMojangFolder;

    try {
        const behaviorPackPath = path.join(projectPath, 'addon', 'behavior_pack');
        const deploymentFolder = path.join(deployPath, 'development_behavior_packs');
        await mkdir(behaviorPackPath, { recursive: true });
        await mkdir(deploymentFolder, { recursive: true });
        await writeFile(path.join(behaviorPackPath, 'sample.txt'), 'deployment content', 'utf8');

        const projectConfig = new MinecraftProjectConfig({
            metadata,
            options: { deploy: { prompt_to_launch_minecraft: true } }
        });
        const project = new AddonMinecraftProject(projectPath, projectConfig);
        MinecraftGameManager.getStableGame = () => new MinecraftStableGame();
        MinecraftGameManager.getComMojangFolder = async () => vscode.Uri.file(deployPath);

        await ProjectDeployer.deployProject(project);

        const deployedPackPath = path.join(deploymentFolder, metadata.id);
        assert.equal(await readFile(path.join(deployedPackPath, 'sample.txt'), 'utf8'), 'deployment content');
        assert.deepEqual(JSON.parse(await readFile(path.join(deployedPackPath, 'contents.json'), 'utf8')), {});
    } finally {
        MinecraftGameManager.getStableGame = originalGetStableGame;
        MinecraftGameManager.getComMojangFolder = originalGetComMojangFolder;
        await rm(projectPath, { recursive: true, force: true });
        await rm(deployPath, { recursive: true, force: true });
    }
}

async function verifyResourcePackExportAndDeployment(): Promise<void> {
    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-resource-project-'));
    const deployPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-resource-target-'));
    const originalGetStableGame = MinecraftGameManager.getStableGame;
    const originalGetComMojangFolder = MinecraftGameManager.getComMojangFolder;

    try {
        const resourcePackPath = path.join(projectPath, 'addon', 'resource_pack');
        const texturePath = path.join(resourcePackPath, 'textures', 'blocks', 'sample.png');
        await mkdir(path.dirname(texturePath), { recursive: true });
        await writeFile(texturePath, 'sample texture', 'utf8');

        const resourceMetadata = { ...metadata, id: 'resource-only-addon' };
        const projectConfig = new MinecraftProjectConfig({
            metadata: resourceMetadata,
            options: { deploy: { prompt_to_launch_minecraft: true } }
        });
        const project = new AddonMinecraftProject(projectPath, projectConfig);

        await ProjectExporter.exportProject(project);

        const textureListPath = path.join(resourcePackPath, 'textures', 'textures_list.json');
        assert.deepEqual(JSON.parse(await readFile(textureListPath, 'utf8')), ['textures/blocks/sample.png']);
        assert.deepEqual(JSON.parse(await readFile(path.join(resourcePackPath, 'contents.json'), 'utf8')), {});
        assert.ok((await stat(path.join(projectPath, 'export', `${resourceMetadata.id}_rp.mcpack`))).size > 0);
        assert.ok((await stat(path.join(projectPath, 'export', `${resourceMetadata.id}.mcaddon`))).size > 0);

        const deploymentFolder = path.join(deployPath, 'development_resource_packs');
        await mkdir(deploymentFolder, { recursive: true });
        MinecraftGameManager.getStableGame = () => new MinecraftStableGame();
        MinecraftGameManager.getComMojangFolder = async () => vscode.Uri.file(deployPath);

        await ProjectDeployer.deployProject(project);

        const deployedPackPath = path.join(deploymentFolder, resourceMetadata.id);
        assert.equal(
            await readFile(path.join(deployedPackPath, 'textures', 'blocks', 'sample.png'), 'utf8'),
            'sample texture'
        );
        assert.deepEqual(
            JSON.parse(await readFile(path.join(deployedPackPath, 'textures', 'textures_list.json'), 'utf8')),
            ['textures/blocks/sample.png']
        );
    } finally {
        MinecraftGameManager.getStableGame = originalGetStableGame;
        MinecraftGameManager.getComMojangFolder = originalGetComMojangFolder;
        await rm(projectPath, { recursive: true, force: true });
        await rm(deployPath, { recursive: true, force: true });
    }
}

async function verifyScriptCompilation(): Promise<void> {
    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-script-'));
    try {
        await mkdir(path.join(projectPath, 'addon', 'behavior_pack'), { recursive: true });
        await linkLocalTypeScript(projectPath);
        const projectConfig = new MinecraftProjectConfig({
            metadata,
            options: { deploy: { prompt_to_launch_minecraft: true } }
        });
        const project = new AddonMinecraftProject(projectPath, projectConfig);

        await ScriptApiService.createScriptApiStructure(vscode.Uri.file(projectPath));
        await withoutGlobalTypeScript(
            projectPath,
            () => ProjectOutputPreparer.prepareProjectForOutput(project)
        );

        const compiledScriptPath = path.join(projectPath, 'addon', 'behavior_pack', 'scripts', 'main.js');
        assert.match(await readFile(compiledScriptPath, 'utf8'), /Hello from main\.ts!/);
        assert.deepEqual(JSON.parse(await readFile(path.join(projectPath, 'addon', 'behavior_pack', 'contents.json'), 'utf8')), {});
    } finally {
        await rm(projectPath, { recursive: true, force: true });
    }
}

async function verifyScriptCompilationFailure(): Promise<void> {
    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-script-error-'));
    try {
        const behaviorPackPath = path.join(projectPath, 'addon', 'behavior_pack');
        await mkdir(behaviorPackPath, { recursive: true });
        await linkLocalTypeScript(projectPath);
        const projectConfig = new MinecraftProjectConfig({
            metadata,
            options: { deploy: { prompt_to_launch_minecraft: true } }
        });
        const project = new AddonMinecraftProject(projectPath, projectConfig);

        await ScriptApiService.createScriptApiStructure(vscode.Uri.file(projectPath));
        await writeFile(path.join(projectPath, 'addon', 'scripts', 'main.ts'), 'const invalid: string = 42;', 'utf8');

        await withoutGlobalTypeScript(
            projectPath,
            () => assert.rejects(
                ProjectOutputPreparer.prepareProjectForOutput(project),
                /Erreur lors de la compilation TypeScript/
            )
        );
        await assert.rejects(stat(path.join(behaviorPackPath, 'contents.json')));
    } finally {
        await rm(projectPath, { recursive: true, force: true });
    }
}

async function verifyGlobalTypeScriptFallback(): Promise<void> {
    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-script-fallback-'));
    try {
        const behaviorPackPath = path.join(projectPath, 'addon', 'behavior_pack');
        const globalBinPath = path.join(projectPath, 'global-bin');
        const fallbackMarkerPath = path.join(projectPath, 'global-tsc-invoked.txt');
        await mkdir(behaviorPackPath, { recursive: true });
        await mkdir(globalBinPath);

        const projectConfig = new MinecraftProjectConfig({
            metadata,
            options: { deploy: { prompt_to_launch_minecraft: true } }
        });
        const project = new AddonMinecraftProject(projectPath, projectConfig);
        await ScriptApiService.createScriptApiStructure(vscode.Uri.file(projectPath));
        await assert.rejects(stat(path.join(projectPath, 'node_modules', 'typescript', 'bin', 'tsc')));

        const extensionPath = VscodeUtils.getContext().extensionPath;
        const extensionTypeScriptPath = path.join(extensionPath, 'node_modules', 'typescript', 'bin', 'tsc');
        const fallbackCommandPath = path.join(globalBinPath, process.platform === 'win32' ? 'tsc.cmd' : 'tsc');
        if (process.platform === 'win32') {
            await writeFile(
                fallbackCommandPath,
                [
                    '@echo off',
                    `echo invoked > "${fallbackMarkerPath}"`,
                    `"${process.execPath}" "${extensionTypeScriptPath}" %*`,
                    'exit /b %errorlevel%',
                    ''
                ].join('\r\n'),
                'utf8'
            );
        } else {
            await writeFile(
                fallbackCommandPath,
                [
                    '#!/bin/sh',
                    `printf invoked > ${quoteShellArgument(fallbackMarkerPath)}`,
                    `exec ${quoteShellArgument(process.execPath)} ${quoteShellArgument(extensionTypeScriptPath)} "$@"`,
                    ''
                ].join('\n'),
                'utf8'
            );
            await chmod(fallbackCommandPath, 0o755);
        }

        await withProcessPath(globalBinPath, () => ProjectOutputPreparer.prepareProjectForOutput(project));

        assert.equal((await readFile(fallbackMarkerPath, 'utf8')).trim(), 'invoked');
        assert.match(
            await readFile(path.join(behaviorPackPath, 'scripts', 'main.js'), 'utf8'),
            /Hello from main\.ts!/
        );
    } finally {
        await rm(projectPath, { recursive: true, force: true });
    }
}

async function verifyProjectInitializationCleanup(): Promise<void> {
    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-cleanup-'));
    try {
        await mkdir(path.join(projectPath, '.vscode'), { recursive: true });
        await mkdir(path.join(projectPath, 'addon', 'behavior_pack'), { recursive: true });
        await mkdir(path.join(projectPath, 'node_modules', 'typescript'), { recursive: true });
        await writeFile(path.join(projectPath, '.vscode', 'settings.json'), '{}', 'utf8');
        await writeFile(path.join(projectPath, '.mcbe_project.json'), '{}', 'utf8');
        await writeFile(path.join(projectPath, 'addon', 'behavior_pack', 'manifest.json'), '{}', 'utf8');
        await writeFile(path.join(projectPath, 'package.json'), '{}', 'utf8');
        await writeFile(path.join(projectPath, 'package-lock.json'), '{}', 'utf8');
        await writeFile(path.join(projectPath, 'node_modules', 'typescript', 'package.json'), '{}', 'utf8');
        await writeFile(path.join(projectPath, 'keep-me.txt'), 'unrelated content', 'utf8');

        await ProjectInitializationCleanup.removeGeneratedEntries(vscode.Uri.file(projectPath));

        for (const entry of ['.vscode', '.mcbe_project.json', 'addon', 'package.json', 'package-lock.json', 'node_modules']) {
            await assert.rejects(stat(path.join(projectPath, entry)));
        }
        assert.equal(await readFile(path.join(projectPath, 'keep-me.txt'), 'utf8'), 'unrelated content');
    } finally {
        await rm(projectPath, { recursive: true, force: true });
    }
}

async function verifyInitCommandRollsBackOnFailure(): Promise<void> {
    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-init-failure-'));
    const projectFolder = vscode.Uri.file(projectPath);
    const originalShowOpenDialog = vscode.window.showOpenDialog;
    const originalShowErrorMessage = vscode.window.showErrorMessage;
    const originalAskProjectMetadata = PromptService.askProjectMetadata;
    const originalAskAddonPackTypes = PromptService.askAddonPackTypes;
    const originalAskBehaviorPackModuleTypes = PromptService.askBehaviorPackModuleTypes;
    const originalCreateScaffold = AddonProjectScaffolder.create;
    const errorMessages: string[] = [];

    try {
        vscode.window.showOpenDialog = async () => [projectFolder];
        vscode.window.showErrorMessage = (async (message: string) => {
            errorMessages.push(message);
            return undefined;
        }) as typeof vscode.window.showErrorMessage;
        PromptService.askProjectMetadata = async () => metadata;
        PromptService.askAddonPackTypes = async () => ['behavior_pack'];
        PromptService.askBehaviorPackModuleTypes = async () => ['data'];
        AddonProjectScaffolder.create = async (folder) => {
            const partialPackFolder = vscode.Uri.joinPath(folder, 'addon', 'behavior_pack');
            await vscode.workspace.fs.createDirectory(partialPackFolder);
            await vscode.workspace.fs.writeFile(
                vscode.Uri.joinPath(partialPackFolder, 'partial.txt'),
                Buffer.from('partial scaffolding')
            );
            throw new Error('injected scaffolding failure');
        };

        await vscode.commands.executeCommand('minecraft-bedrock-creators-utilities.initProject');

        assert.ok(errorMessages.some(message => message.includes('injected scaffolding failure')));
        assert.deepEqual(await vscode.workspace.fs.readDirectory(projectFolder), []);
    } finally {
        vscode.window.showOpenDialog = originalShowOpenDialog;
        vscode.window.showErrorMessage = originalShowErrorMessage;
        PromptService.askProjectMetadata = originalAskProjectMetadata;
        PromptService.askAddonPackTypes = originalAskAddonPackTypes;
        PromptService.askBehaviorPackModuleTypes = originalAskBehaviorPackModuleTypes;
        AddonProjectScaffolder.create = originalCreateScaffold;
        await rm(projectPath, { recursive: true, force: true });
    }
}

async function verifyJsonDiagnosticsActivation(): Promise<void> {
    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-json-assistance-'));
    const workspaceIndex = vscode.workspace.workspaceFolders?.length ?? 0;
    const originalFetchVersioned = SchemaFetcher.fetchVersioned;
    let workspaceAdded = false;

    try {
        const behaviorPackPath = path.join(projectPath, 'addon', 'behavior_pack');
        const entityPath = path.join(behaviorPackPath, 'entities', 'sample.json');
        await mkdir(path.dirname(entityPath), { recursive: true });
        await writeFile(
            path.join(behaviorPackPath, 'manifest.json'),
            JSON.stringify({ modules: [{ type: 'data' }] }),
            'utf8'
        );
        await writeFile(entityPath, '{}', 'utf8');

        SchemaFetcher.fetchVersioned = async () => ({
            baseSchema: { type: 'object', required: ['extensionLifecycleProbe'] },
            versionedChanges: []
        });

        workspaceAdded = vscode.workspace.updateWorkspaceFolders(workspaceIndex, 0, {
            uri: vscode.Uri.file(projectPath),
            name: 'JSON assistance integration test'
        });
        assert.equal(workspaceAdded, true);

        const document = await vscode.workspace.openTextDocument(vscode.Uri.file(entityPath));
        let hasExpectedDiagnostic = false;
        for (let attempt = 0; attempt < 50; attempt++) {
            hasExpectedDiagnostic = vscode.languages.getDiagnostics(document.uri)
                .some(diagnostic => diagnostic.message === 'Missing property "extensionLifecycleProbe".');
            if (hasExpectedDiagnostic) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 20));
        }

        assert.equal(hasExpectedDiagnostic, true, 'Opening a Minecraft JSON document should trigger schema diagnostics.');
    } finally {
        SchemaFetcher.fetchVersioned = originalFetchVersioned;
        if (workspaceAdded) {
            vscode.workspace.updateWorkspaceFolders(workspaceIndex, 1);
        }
        await rm(projectPath, { recursive: true, force: true });
    }
}

async function verifyExtensionLifecycle(): Promise<void> {
    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes('minecraft-bedrock-creators-utilities.initProject'));
    assert.ok(commands.includes('minecraft-bedrock-creators-utilities.exportProject'));

    const subscriptions: vscode.Disposable[] = [];
    await MinecraftProjectManager.initialize(subscriptions);
    assert.equal(subscriptions.length, 5);

    MinecraftProjectManager.dispose();
    assert.equal(MinecraftProjectManager.hasProject(), false);
    MinecraftProjectManager.dispose();
}

export async function run(): Promise<void> {
    const extension = vscode.extensions.all.find(
        candidate => candidate.packageJSON.name === 'minecraft-bedrock-creators-utilities'
    );
    assert.ok(extension, 'The extension under test must be loaded.');
    await extension.activate();
    assert.equal(extension.isActive, true);

    const projectPath = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-addon-'));
    const projectFolder = vscode.Uri.file(projectPath);

    try {
        const options: AddonStructureOptions = {
            packTypes: ['behavior_pack', 'resource_pack'],
            behaviorPackModuleTypes: ['data']
        };
        await AddonProjectScaffolder.create(projectFolder, metadata, options);

        const addonFolder = vscode.Uri.joinPath(projectFolder, 'addon');
        const behaviorPackFolder = vscode.Uri.joinPath(addonFolder, 'behavior_pack');
        const resourcePackFolder = vscode.Uri.joinPath(addonFolder, 'resource_pack');
        const behaviorManifest = await readJson(vscode.Uri.joinPath(behaviorPackFolder, 'manifest.json'));
        const resourceManifest = await readJson(vscode.Uri.joinPath(resourcePackFolder, 'manifest.json'));
        const packageJson = await readJson(vscode.Uri.joinPath(projectFolder, 'package.json'));
        const sourceIcon = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(
            VscodeUtils.getContext().extensionUri,
            'assets',
            'icons',
            'default_pack_icon.png'
        ));
        const behaviorIcon = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(behaviorPackFolder, 'pack_icon.png'));
        const resourceIcon = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(resourcePackFolder, 'pack_icon.png'));

        assert.deepEqual(behaviorManifest.dependencies, [{
            uuid: resourceManifest.header.uuid,
            version: resourceManifest.header.version
        }]);
        assert.deepEqual(resourceManifest.dependencies, [{
            uuid: behaviorManifest.header.uuid,
            version: behaviorManifest.header.version
        }]);
        assert.equal(resourceManifest.header.pack_scope, 'world');
        assert.deepEqual(packageJson.dependencies, {});
        assert.deepEqual(behaviorIcon, sourceIcon);
        assert.deepEqual(resourceIcon, sourceIcon);
        assert.equal(
            Buffer.from(await vscode.workspace.fs.readFile(vscode.Uri.joinPath(behaviorPackFolder, 'texts', 'en_US.lang'))).toString('utf8'),
            'pack.name=Integration Add-on BP [v0.0.1] - by Integration Test\npack.description=Pack for Integration Add-on - Created by Integration Test'
        );
    } finally {
        await rm(projectPath, { recursive: true, force: true });
    }

    await verifyProjectExport();
    await verifyProjectDeployment();
    await verifyResourcePackExportAndDeployment();
    await verifyScriptCompilation();
    await verifyScriptCompilationFailure();
    await verifyGlobalTypeScriptFallback();
    await verifyProjectInitializationCleanup();
    await verifyInitCommandRollsBackOnFailure();
    await verifyJsonDiagnosticsActivation();
    await verifyExtensionLifecycle();
    console.log('VS Code Add-on scaffolding, export, deployment, and Script API integration tests passed.');
}
