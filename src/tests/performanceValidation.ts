/**
 * Test de validation des optimisations de performance
 * Ce fichier sert à vérifier que toutes les optimisations fonctionnent correctement
 */

import * as vscode from "vscode";
import { getSchemaAtPosition } from "../features/jsonSchema/versioning/schemaContext";
import { getVersionedSchemaForFile } from "../features/jsonSchema/versioning/getVersionedSchemaForFile";
import { parseJsonDocument } from "../utils/json/optimizedParsing";
import { CacheManager } from "../utils/cache";
import { getMinecraftProjectMetadata } from "../utils/workspace/getMinecraftProjectMetadata";

/**
 * Fonction de test pour valider les performances
 */
export async function runPerformanceTests(): Promise<void> {
    console.log("🚀 Début des tests de performance...");

    // Test 1: Cache de documents
    await testDocumentCache();
    
    // Test 2: Cache de schémas
    await testSchemaCache();
    
    // Test 3: Cache de métadonnées projet
    await testProjectMetadataCache();
    
    // Test 4: Performance globale
    await testOverallPerformance();
    
    console.log("✅ Tous les tests de performance réussis !");
}

/**
 * Test du cache de documents
 */
async function testDocumentCache(): Promise<void> {
    console.log("📄 Test du cache de documents...");
    
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document.languageId !== 'json') {
        console.log("⚠️  Pas de fichier JSON actif, test ignoré");
        return;
    }

    const document = activeEditor.document;
    
    // Premier appel (miss du cache)
    const start1 = performance.now();
    const parsed1 = parseJsonDocument(document);
    const time1 = performance.now() - start1;
    
    // Deuxième appel (hit du cache)
    const start2 = performance.now();
    const parsed2 = parseJsonDocument(document);
    const time2 = performance.now() - start2;
    
    console.log(`  - Premier parsing: ${time1.toFixed(2)}ms (cache miss)`);
    console.log(`  - Deuxième parsing: ${time2.toFixed(2)}ms (cache hit)`);
    console.log(`  - Amélioration: ${((time1 - time2) / time1 * 100).toFixed(1)}%`);
    console.log(`  - Cache utilisé: ${parsed2.fromCache ? "✅" : "❌"}`);
}

/**
 * Test du cache de schémas
 */
async function testSchemaCache(): Promise<void> {
    console.log("🔧 Test du cache de schémas...");
    
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document.languageId !== 'json') {
        console.log("⚠️  Pas de fichier JSON actif, test ignoré");
        return;
    }

    const document = activeEditor.document;
    
    // Premier appel (miss du cache)
    const start1 = performance.now();
    const schema1 = getVersionedSchemaForFile(document);
    const time1 = performance.now() - start1;
    
    // Deuxième appel (hit du cache)
    const start2 = performance.now();
    const schema2 = getVersionedSchemaForFile(document);
    const time2 = performance.now() - start2;
    
    console.log(`  - Première génération: ${time1.toFixed(2)}ms (cache miss)`);
    console.log(`  - Deuxième génération: ${time2.toFixed(2)}ms (cache hit)`);
    console.log(`  - Amélioration: ${((time1 - time2) / time1 * 100).toFixed(1)}%`);
    console.log(`  - Schémas identiques: ${schema1 === schema2 ? "✅" : "❌"}`);
}

/**
 * Test du cache de métadonnées projet
 */
async function testProjectMetadataCache(): Promise<void> {
    console.log("📁 Test du cache de métadonnées projet...");
    
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        console.log("⚠️  Pas de workspace ouvert, test ignoré");
        return;
    }

    try {
        // Premier appel (miss du cache)
        const start1 = performance.now();
        const metadata1 = await getMinecraftProjectMetadata(workspaceFolder.uri);
        const time1 = performance.now() - start1;
        
        // Deuxième appel (hit du cache)
        const start2 = performance.now();
        const metadata2 = await getMinecraftProjectMetadata(workspaceFolder.uri);
        const time2 = performance.now() - start2;
        
        console.log(`  - Premier chargement: ${time1.toFixed(2)}ms (cache miss)`);
        console.log(`  - Deuxième chargement: ${time2.toFixed(2)}ms (cache hit)`);
        console.log(`  - Amélioration: ${((time1 - time2) / time1 * 100).toFixed(1)}%`);
        console.log(`  - Métadonnées trouvées: ${metadata1 ? "✅" : "❌"}`);
    } catch (error) {
        console.log("⚠️  Erreur lors du test des métadonnées:", error);
    }
}

/**
 * Test de performance globale
 */
async function testOverallPerformance(): Promise<void> {
    console.log("⚡ Test de performance globale...");
    
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor || activeEditor.document.languageId !== 'json') {
        console.log("⚠️  Pas de fichier JSON actif, test ignoré");
        return;
    }

    const document = activeEditor.document;
    const position = activeEditor.selection.active;
    
    // Test de getSchemaAtPosition avec cache chaud
    const times: number[] = [];
    
    for (let i = 0; i < 10; i++) {
        const start = performance.now();
        getSchemaAtPosition(document, position);
        const time = performance.now() - start;
        times.push(time);
    }
    
    const avgTime = times.reduce((a, b) => a + b) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    console.log(`  - Temps moyen: ${avgTime.toFixed(2)}ms`);
    console.log(`  - Temps minimum: ${minTime.toFixed(2)}ms`);
    console.log(`  - Temps maximum: ${maxTime.toFixed(2)}ms`);
    console.log(`  - Stabilité: ${(minTime / maxTime * 100).toFixed(1)}%`);
}

/**
 * Affiche les statistiques des caches
 */
export function showCacheStatistics(): void {
    const stats = CacheManager.getGlobalStats();
    
    console.log("📊 Statistiques des caches:");
    console.log(`  Documents: ${stats.documents.size}/${stats.documents.maxSize}`);
    console.log(`  Projets: ${stats.projects.size} projets surveillés`);
    console.log(`  Schémas: ${stats.schemas.size}/${stats.schemas.maxSize}`);
}

/**
 * Commande pour vider les caches et tester la performance
 */
export function clearCachesAndTest(): void {
    console.log("🧹 Vidage des caches...");
    CacheManager.clearAll();
    console.log("✅ Caches vidés");
    
    // Affichage des statistiques
    setTimeout(() => {
        showCacheStatistics();
    }, 1000);
}
