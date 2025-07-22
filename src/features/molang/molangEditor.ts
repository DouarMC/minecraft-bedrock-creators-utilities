import * as vscode from 'vscode';
import { parseTree, findNodeAtLocation } from 'jsonc-parser';
import { getInMemoryFileSystemProvider } from '../providers/InMemoryFileSystemProvider';

const molangContextMap = new Map<string, { originUri: vscode.Uri, path: string[] }>();

export function registerMolangEditorCommand(context: vscode.ExtensionContext) {
    const provider = getInMemoryFileSystemProvider();
    if (!provider) {
        console.error("InMemoryFileSystemProvider introuvable.");
        return;
    }

    context.subscriptions.push(
        vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.openMolangEditor", async (uri: vscode.Uri, path: string[]) => {
            const document = await vscode.workspace.openTextDocument(uri);
            const root = parseTree(document.getText());
            if (!root) return;

            const node = findNodeAtLocation(root, path);
            const currentValue = node?.value !== undefined ? String(node.value) : "";

            // Crée un URI virtuel unique
            const virtualUri = vscode.Uri.parse(`molang:/temp_${Date.now()}.molang`);
            provider.writeVirtualFile(virtualUri, currentValue);
            molangContextMap.set(virtualUri.toString(), { originUri: uri, path });

            // Ouvre le fichier virtuel
            const virtualDoc = await vscode.workspace.openTextDocument(virtualUri);
            const virtualEditor = await vscode.window.showTextDocument(virtualDoc, { preview: false, viewColumn: vscode.ViewColumn.Beside });

            virtualEditor.options = { 
                ...virtualEditor.options, 
                insertSpaces: false, 
                tabSize: 4,
                lineNumbers: vscode.TextEditorLineNumbersStyle.On
            };

            // 🔁 Enregistrement automatique à chaque modification
            const autoSaveDisposable = vscode.workspace.onDidChangeTextDocument(async event => {
                if (event.document.uri.toString() === virtualUri.toString()) {
                    console.log("[AutoSave] Changement détecté pour :", virtualUri.toString());

                    try {
                        await virtualDoc.save();
                    } catch (error) {
                        console.warn("🔁 Conflit de sauvegarde ignoré (VS Code pense que le fichier est plus récent).");
                    }
                }
            });

            // Nettoyage automatique quand l'éditeur est fermé
            const closeWatcher = vscode.window.onDidChangeVisibleTextEditors(async editors => {
                const isEditorStillOpen = editors.some(editor => editor.document.uri.toString() === virtualUri.toString());
                if (isEditorStillOpen) return;

                // ⚠️ l’éditeur n’est plus visible → on considère que l'utilisateur l’a "fermé"
                autoSaveDisposable.dispose();
                closeWatcher.dispose();

                const context = molangContextMap.get(virtualUri.toString());
                molangContextMap.delete(virtualUri.toString());
                if (!context) return;

                const updatedValue = provider.readFile(virtualUri); // ⚠️ ici, on lit directement la Map
                const updatedText = new TextDecoder().decode(updatedValue);

                const originDoc = await vscode.workspace.openTextDocument(context.originUri);
                const root = parseTree(originDoc.getText());
                if (!root) return;

                const range = getNodeRangeFromPath(originDoc, context.path);
                if (!range) return;

                const edit = new vscode.WorkspaceEdit();
                edit.replace(context.originUri, range, JSON.stringify(updatedText));
                await vscode.workspace.applyEdit(edit);

                console.log("✅ Valeur Molang réinjectée avec succès.");
            });


            // Inscrit les deux listeners dans les subscriptions de l'extension
            context.subscriptions.push(autoSaveDisposable, closeWatcher);
        })
    );
}

/**
 * Récupère la plage de nœud à partir du chemin donné dans le document
 * @param document Le document dans lequel chercher le nœud
 * @param path Le chemin du nœud sous forme de tableau de chaînes
 * @returns 
 */
function getNodeRangeFromPath(document: vscode.TextDocument, path: string[]): vscode.Range | null {
    const root = parseTree(document.getText());
    if (!root) {
        return null;
    }

    const node = findNodeAtLocation(root, path); // ✅ pas de normalizePath
    if (!node) {
        return null;
    }

    return new vscode.Range(
        document.positionAt(node.offset),
        document.positionAt(node.offset + node.length)
    );
}