import * as vscode from 'vscode';

/**
 * Fonction pour écrire un fichier JSON avec une mise en forme lisible, utile pour les manifestes de packs de ressources et de comportement.
 * Elle compresse les tableaux "version" et "min_engine_version" pour qu'ils soient sur une seule ligne.
 * @param uri le URI du fichier JSON à écrire
 * @param obj l'objet JavaScript à écrire dans le fichier JSON
 */
export async function writeJsonFilePretty(uri: vscode.Uri, obj: any) {
    let content = JSON.stringify(obj, null, 4);

    // Met "version" inline
    content = content.replace(/"version": \[\s*([^\]]+?)\s*\]/g, (match, p1) => {
        const compact = p1.replace(/\s+/g, " ").trim();
        return `"version": [${compact}]`;
    });

    // Met "min_engine_version" inline
    content = content.replace(/"min_engine_version": \[\s*([^\]]+?)\s*\]/g, (match, p1) => {
        const compact = p1.replace(/\s+/g, " ").trim();
        return `"min_engine_version": [${compact}]`;
    });

    // Ecrit le contenu dans le fichier spécifié par l'URI
    await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
}