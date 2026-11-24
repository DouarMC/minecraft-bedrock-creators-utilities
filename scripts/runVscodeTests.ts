import { runTests } from '@vscode/test-electron';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import * as path from 'path';

async function main(): Promise<void> {
    const extensionDevelopmentPath = process.cwd();
    const extensionTestsPath = path.resolve(extensionDevelopmentPath, 'out', 'test', 'vscode', 'index.js');
    const vscodeExecutablePath = process.env.VSCODE_EXECUTABLE_PATH;
    const userDataDirectory = await mkdtemp(path.join(tmpdir(), 'mbcu-vscode-test-'));

    try {
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [
                '--user-data-dir',
                userDataDirectory,
                '--extensions-dir',
                path.join(userDataDirectory, 'extensions'),
                '--disable-workspace-trust',
                '--disable-updates'
            ],
            ...(vscodeExecutablePath ? { vscodeExecutablePath } : {})
        });
    } finally {
        await rm(userDataDirectory, { recursive: true, force: true });
    }
}

main().catch((error: unknown) => {
    console.error('VS Code integration tests failed:', error);
    process.exitCode = 1;
});
