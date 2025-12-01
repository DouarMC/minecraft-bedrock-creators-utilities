import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { VersionedSchema } from '../common/types/VersionedSchema';

// CONFIGURATION
const SOURCE_DIR = path.join(__dirname, "../minecraftSchemas");
const DIST_DIR = path.join(__dirname, '../dist/minecraftSchemas');
const IGNORED_FOLDERS = ["shared"];

/**
 * Fonction récursive pour trouver tous les fichiers .ts
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // On ignore les dossiers utilitaires
            if (! IGNORED_FOLDERS.includes(file)) {
                getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            // On ne prend que les fichiers .ts (et on ignore les fichiers de définition .d.ts)
            if (file.endsWith('.ts') && ! file.endsWith('.d.ts')) {
                arrayOfFiles.push(fullPath);         
            }
        }
    }

    return arrayOfFiles;
}

/**
 * Fonction principale pour construire les schémas
 */
async function buildSchemas() {
    console.log("🚀 Démarrage de la génération des schémas...");

    // 1. Nettoyer ou créer le dossier de destination
    if (! fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // 2. Récupérer tous les fichiers sources
    const allSourceFiles = getAllFiles(SOURCE_DIR);
    for (const filePath of allSourceFiles) {
        try {
            // 3. Import Dynamique du fichier ts
            // On utilise import() qui fonctionne avec ts-node
            const fileUrl = pathToFileURL(filePath).href;
            const importedModule = await import(fileUrl);

            // On récupère l'export par défaut
            const versionedSchema: VersionedSchema = importedModule.default;

            // Vérification de sécurité : est-ce qu'il y a bien des données ?
            if (! versionedSchema || ! versionedSchema.baseSchema) {
                console.warn(`⚠️  Fichier ignoré (pas d'export default valide) : ${path.basename(filePath)}`);
                continue;
            }

            // 4. Calculer le chemin de sortie pour garder la même structure de dossiers
            // Ex: source/behavior_pack/entity.ts -> dist/behavior_pack/entity.json
            const relativePath = path.relative(SOURCE_DIR, filePath);
            const relativeDir = path.dirname(relativePath);
            const fileName = path.basename(relativePath, '.ts') + '.json';

            const targetDir = path.join(DIST_DIR, relativeDir);
            const targetFilePath = path.join(targetDir, fileName);

            // Créer le sous-dossier si nécessaire (ex: dist/behavior_pack)
            if (! fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            // 5. Écrire le JSON
            fs.writeFileSync(targetFilePath, JSON.stringify(versionedSchema, null, 4), 'utf-8');

            console.log(`✅ Généré : ${relativeDir}/${fileName}`);
        } catch (error) {
            console.error(`❌ Erreur sur ${filePath}:`, error);
            process.exit(1); // Arrêter le build en cas d'erreur critique
        }
    }

    console.log("🎉 Génération des schémas terminée !");
}

// Lancer le build
buildSchemas();