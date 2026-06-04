import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as ts from 'typescript';

const SOURCE_DIR = path.join(__dirname, "../../minecraftSchemas");
const WEB_DIR = path.join(__dirname, "web");
const PORT = 4500;

// Utilitaire de recherche récursive des schémas .ts
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== "shared") getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
            arrayOfFiles.push(fullPath);
        }
    }
    return arrayOfFiles;
}

// Logique AST robuste pour injecter la version
function addVersionToSchemaFile(filePath: string, newVersion: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

    let versionExistsInChanges = false;
    let targetInsertionPos = -1;
    let isFormatVersionEnumFound = false;
    let enumInsertionPos = -1;

    // 1. Un seul passage d'analyse de l'arbre (AST) pour tout localiser de façon safe
    function analyzeVisitor(node: ts.Node) {
        // Détection du tableau principal versionedChanges
        if (ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === "versionedChanges") {
            if (node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
                // Sauvegarde de la VRAIE position de fin du tableau principal (juste avant son ']')
                targetInsertionPos = node.initializer.getEnd() - 1;

                // Vérification des doublons
                for (const element of node.initializer.elements) {
                    if (ts.isObjectLiteralExpression(element)) {
                        const versionProp = element.properties.find(
                            p => p.name && p.name.getText(sourceFile) === "version"
                        );
                        if (versionProp && ts.isPropertyAssignment(versionProp)) {
                            const val = versionProp.initializer.getText(sourceFile).replace(/['"]/g, '');
                            if (val === newVersion) versionExistsInChanges = true;
                        }
                    }
                }
            }
        }

        // Détection de l'enum format_version dans le baseSchema
        if (ts.isPropertyAssignment(node) && node.name.getText(sourceFile) === "enum") {
            if (ts.isArrayLiteralExpression(node.initializer)) {
                const elements = node.initializer.elements;
                const currentVersions = elements.map(e => e.getText(sourceFile).replace(/['"]/g, ''));
                
                if (!currentVersions.includes(newVersion) && elements.length > 0) {
                    isFormatVersionEnumFound = true;
                    enumInsertionPos = elements[elements.length - 1].getEnd();
                }
            }
        }

        ts.forEachChild(node, analyzeVisitor);
    }

    analyzeVisitor(sourceFile);

    // Sécurités
    if (versionExistsInChanges) {
        throw new Error(`La version "${newVersion}" est déjà présente dans versionedChanges.`);
    }
    if (targetInsertionPos === -1) {
        throw new Error("Impossible de localiser le tableau `versionedChanges` dans le fichier.");
    }

    // 2. Application des modifications par ordre décroissant de position pour ne pas fausser les index
    let modifiedContent = fileContent;

    // Étape A : On injecte le squelette dans versionedChanges (en fin de tableau principal)
    const newVersionTemplate = `,\n    {\n        version: "${newVersion}",\n        changes: []\n    }`;
    
    if (isFormatVersionEnumFound && enumInsertionPos > targetInsertionPos) {
        // Cas rare où l'enum est après versionedChanges dans le fichier
        modifiedContent = modifiedContent.slice(0, enumInsertionPos) + `, "${newVersion}"` + modifiedContent.slice(enumInsertionPos);
        modifiedContent = modifiedContent.slice(0, targetInsertionPos) + newVersionTemplate + modifiedContent.slice(targetInsertionPos);
    } else {
        // Cas standard : versionedChanges est plus bas que l'enum
        modifiedContent = modifiedContent.slice(0, targetInsertionPos) + newVersionTemplate + modifiedContent.slice(targetInsertionPos);
        if (isFormatVersionEnumFound) {
            modifiedContent = modifiedContent.slice(0, enumInsertionPos) + `, "${newVersion}"` + modifiedContent.slice(enumInsertionPos);
        }
    }

    fs.writeFileSync(filePath, modifiedContent, 'utf-8');
}

// Serveur HTTP Natif (Sert les fichiers web + API)
const server = http.createServer((req, res) => {
    const url = new URL(req.url || '', `http://localhost:${PORT}`);

    // --- SECTION API ---
    if (url.pathname === '/api/files' && req.method === 'GET') {
        const files = getAllFiles(SOURCE_DIR).map(f => path.relative(SOURCE_DIR, f));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(files));
        return;
    }

    if (url.pathname === '/api/add-version' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { fileRelativePath, version } = JSON.parse(body);
            const absolutePath = path.join(SOURCE_DIR, fileRelativePath);

            try {
                addVersionToSchemaFile(absolutePath, version);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: `Version ${version} injectée avec succès !` }));
            } catch (err: any) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // --- SECTION ROUTAGE STATIQUE (WEB) ---
    let filePath = path.join(WEB_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
    
    // Sécurité élémentaire pour éviter de lire hors du dossier web
    if (!filePath.startsWith(WEB_DIR)) {
        res.writeHead(403);
        res.end("Accès refusé");
        return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        let contentType = 'text/plain';
        if (ext === '.html') contentType = 'text/html; charset=utf-8';
        if (ext === '.css') contentType = 'text/css; charset=utf-8';
        if (ext === '.js') contentType = 'application/javascript; charset=utf-8';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end("Fichier non trouvé");
    }
});

server.listen(PORT, () => {
    console.log(`\n🔥 Outil de gestion propre démarré sur : http://localhost:${PORT}`);
});