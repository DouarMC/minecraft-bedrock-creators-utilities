import * as vscode from 'vscode';
import { parseTree, findNodeAtLocation } from 'jsonc-parser';

export function registerMolangEditorCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.openMolangEditor", async (uri: vscode.Uri, path: string[]) => {
            const document = await vscode.workspace.openTextDocument(uri); // On récupère le document à partir de l'URI
            const root = parseTree(document.getText());
            if (!root) {
                return;
            }

            const node = findNodeAtLocation(root, path);
            const currentValue = node?.value !== undefined ? node.value : "";

            // On crée un panel pour l'éditeur Molang
            const panel = vscode.window.createWebviewPanel(
                "molangEditor",
                "Éditeur Molang",
                vscode.ViewColumn.Beside,
                {enableScripts: true}
            );

            panel.webview.html = getMolangEditorHtml(currentValue); // On définit le contenu HTML du panel

            panel.webview.onDidReceiveMessage(msg => {
                if (msg.value) {
                    const range = getNodeRangeFromPath(document, path);
                    if (range) {
                        const edit = new vscode.WorkspaceEdit();
                        edit.replace(document.uri, range, JSON.stringify(msg.value)); // garde les guillemets si string
                        vscode.workspace.applyEdit(edit);
                    }
                    panel.dispose(); // On ferme le panel après l'application
                }
            });
        })
    );
}

/**
 * Génère le contenu HTML pour l'éditeur Molang
 * @param currentValue La valeur actuelle de Molang à afficher dans l'éditeur
 * @returns 
 */
function getMolangEditorHtml(currentValue: string): string {
    return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Molang Editor</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            background: #1e1e1e;
            color: white;
        }
        #editor-container {
            height: calc(100% - 40px);
        }
        #submit-button {
            width: 100%;
            height: 40px;
            font-size: 16px;
            background: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="editor-container"></div>
    <button id="submit-button">✅ Appliquer</button>

    <!-- Monaco via CDN -->
    <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js"></script>
    <script>
        const initialValue = \`${currentValue.replace(/`/g, '\\`')}\`;
        const vscode = acquireVsCodeApi();

        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' }});
        require(['vs/editor/editor.main'], function () {
            monaco.languages.register({ id: 'molang' });

            monaco.languages.setMonarchTokensProvider('molang', {
                tokenizer: {
                    root: [
                        [/\b(true|false|null)\b/, "keyword"],
                        [/\b(query|variable|math|animation)\b/, "identifier"],
                        [/[a-zA-Z_][\\w.]*/, "variable"],
                        [/\\d+(\\.\\d+)?/, "number"],
                        [/[-+*/%=!<>]+/, "operator"],
                        [/[{}()\\[\\]]/, "@brackets"]
                    ]
                }
            });

            monaco.languages.registerCompletionItemProvider('molang', {
                provideCompletionItems: () => {
                    return {
                        suggestions: [
                            {
                                label: 'query.is_sprinting',
                                kind: monaco.languages.CompletionItemKind.Property,
                                insertText: 'query.is_sprinting',
                                documentation: 'Retourne true si l’entité est en train de sprinter.'
                            }
                        ]
                    };
                }
            });

            monaco.languages.registerHoverProvider('molang', {
                provideHover: function(model, position) {
                    const word = model.getWordAtPosition(position);
                    if (!word) return;

                    const text = word.word;
                    if (text === 'query.is_sprinting') {
                        return {
                            range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
                            contents: [
                                { value: '**query.is_sprinting**' },
                                { value: 'Retourne true si l’entité est en train de sprinter.' }
                            ]
                        };
                    }
                }
            });

            const editor = monaco.editor.create(document.getElementById('editor-container'), {
                value: initialValue,
                language: 'molang',
                theme: 'vs-dark',
                automaticLayout: true
            });

            document.getElementById('submit-button').addEventListener('click', () => {
                const value = editor.getValue();
                vscode.postMessage({ value });
            });
        });
    </script>
</body>
</html>
    `;
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