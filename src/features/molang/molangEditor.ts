import * as vscode from 'vscode';
import { parseTree, findNodeAtLocation } from 'jsonc-parser';

export function registerMolangEditorCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.openMolangEditor", async (uri: vscode.Uri, path: string[]) => {
            const document = await vscode.workspace.openTextDocument(uri); // On récupère le document à partir de l'URI
            const text = document.getText(); // On récupère le texte du document

            const root = parseTree(text);
            if (!root) {
                return;
            }
            const node = findNodeAtLocation(root, normalizePath(path));
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
                        console.log("ON A UNE RANGE OEEEEEE");
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
<html>
<head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="https://unpkg.com/codemirror@5.65.15/lib/codemirror.css">
    <link rel="stylesheet" href="https://unpkg.com/codemirror@5.65.15/theme/darcula.css">
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            background: #1e1e1e;
            color: white;
        }
        .editor-container {
            height: calc(100% - 40px);
        }
        .CodeMirror {
            height: 100%;
            font-size: 14px;
        }
        button {
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
    <div class="editor-container">
        <textarea id="editor">${currentValue}</textarea>
    </div>
    <button onclick="apply()">✅ Appliquer</button>

    <script src="https://unpkg.com/codemirror@5.65.15/lib/codemirror.js"></script>
    <script src="https://unpkg.com/codemirror@5.65.15/mode/javascript/javascript.js"></script>
    <script>
        const vscode = acquireVsCodeApi();
        const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'darcula',
        });

        function apply() {
            const value = editor.getValue();
            vscode.postMessage({ value });
        }
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

    const node = findNodeAtLocation(root, normalizePath(path));
    if (!node) {
        return null;
    }

    return new vscode.Range(
        document.positionAt(node.offset),
        document.positionAt(node.offset + node.length)
    );
}

/**
 * Normalise le chemin pour convertir les clés numériques en nombres
 * @param path Le chemin à normaliser, sous forme de tableau de chaînes
 * @returns 
 */
function normalizePath(path: string[]): (string | number)[] {
    return path.map(key => {
        const num = Number(key);
        return !isNaN(num) && /^\d+$/.test(key) ? num : key;
    });
}