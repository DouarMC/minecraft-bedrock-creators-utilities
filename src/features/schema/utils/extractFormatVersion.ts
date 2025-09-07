import * as vscode from 'vscode';
import * as JsonParser from 'jsonc-parser';

/**
 * Extrait la format_version du document JSON de façon robuste
 */
export function extractFormatVersion(document: vscode.TextDocument): string | number | undefined {
    const text = document.getText();
    
    // 🚀 Tentative 1: JSON.parse standard (le plus rapide si JSON valide)
    try {
        const json = JsonParser.parse(text);
        return json.format_version || undefined;
    } catch {
        // 🛡️ Fallback: Regex simple si JSON invalide
        const match = text.match(/"format_version"\s*:\s*"([^"]+)"/);
        return match ? match[1] : undefined;
    }
}