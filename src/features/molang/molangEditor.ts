import * as vscode from 'vscode';

export function registerMolangEditorCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("minecraft-bedrock-creators-utilities.openMolangEditor", async (uri: vscode.Uri, path: string[]) => {
            const document = await vscode.workspace.openTextDocument(uri); // On récupère le document à partir de l'URI
            const text = document.getText(); // On récupère le texte du document

            // Tu pourras plus tard parser le JSON et extraire la valeur avec jsonc-parser
            const currentValue = "query.health > 0.5"; // temporaire

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
                    vscode.window.showInformationMessage(`Valeur Molang : ${msg.value}`);
                    panel.dispose();
                    // 🔁 Plus tard : insérer cette valeur dans le document via WorkspaceEdit
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
    return `
<html>
<body>
    <textarea id="editor" style="width:100%; height:90vh; font-family:monospace; font-size:14px;">${currentValue}</textarea>
    <button onclick="apply()">✅ Appliquer</button>

    <script>
        const vscode = acquireVsCodeApi();
        function apply() {
            const value = document.getElementById('editor').value;
            vscode.postMessage({ value });
        }
    </script>
</body>
</html>
    `;
}