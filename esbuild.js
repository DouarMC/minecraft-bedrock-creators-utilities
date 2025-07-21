// Ce fichier configure le bundler esbuild pour compiler l’extension VS Code.
// Il permet de générer un fichier JavaScript à partir du TypeScript source,
// en mode développement (--watch) ou production (--production).

const esbuild = require("esbuild"); // Importe le module esbuild, un bundler ultra-rapide pour transformer le code TypeScript en JavaScript

const production = process.argv.includes('--production'); // Active le mode production si l'argument "--production" est passé dans la ligne de commande (ex: `node esbuild.js --production`). Le mode production active la minification du code pour réduire sa taille et améliorer les performances.
const watch = process.argv.includes('--watch'); // Active le mode "watch" si l’argument "--watch" est passé (ex: `node esbuild.js --watch`). Cela permet à esbuild de surveiller les fichiers source et de recompiler automatiquement en cas de modification.


/**
 * Plugin personnalisé pour esbuild qui affiche clairement les erreurs dans le terminal.
 * Il s’exécute à chaque début et fin de compilation (`onStart`, `onEnd`).
 * 
 * - `onStart`: Affiche un message quand le build commence (utile en mode watch).
 * - `onEnd`: Affiche les erreurs (avec fichier + ligne/colonne) si la compilation échoue.
 */
/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		// Callback appelé au début de chaque compilation
		build.onStart(() => {
			console.log('[watch] build started');
		});

		// Callback appelé à la fin de chaque compilation
		build.onEnd((result) => {
			// Pour chaque erreur, affiche un message clair avec fichier + ligne/colonne
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

/**
 * Fonction principale qui configure et exécute le bundler esbuild pour compiler l’extension.
 * Elle utilise `esbuild.context()` pour créer un contexte réutilisable (notamment pour le mode watch).
 */
async function main() {
	// Création du contexte de build avec toutes les options nécessaires
	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts' // Point d’entrée principal du code TypeScript
		],
		bundle: true, // Combine tous les fichiers importés en un seul fichier JS
		format: 'cjs', // Format CommonJS (obligatoire pour Node.js)
		minify: production, // Réduit la taille du fichier final si on est en mode production
		sourcemap: !production, // Génère un .map uniquement si on n’est PAS en mode production
		sourcesContent: false, // Exclut le contenu source des fichiers .map pour alléger
		platform: 'node', // Cible un environnement Node.js (pas navigateur)
		outfile: 'dist/extension.js', // Fichier de sortie généré
		external: ['vscode'], // Exclut le module 'vscode' du bundle (fourni par VS Code lui-même)
		logLevel: 'silent', // Désactive les logs d’esbuild (on se sert du plugin à la place)
		plugins: [
			esbuildProblemMatcherPlugin // Affiche les erreurs de compilation en clair
		],
	});

	// Si le script a été lancé avec --watch, on entre en mode "surveillance continue"
	if (watch) {
		await ctx.watch(); // Reste actif et recompile à chaque changement
	} else {
		// Sinon, compile une seule fois puis ferme le contexte
		await ctx.rebuild();
		await ctx.dispose();
	}
}

// Exécute la fonction `main()` et intercepte les erreurs éventuelles
main().catch(e => {
	console.error(e); // Affiche l’erreur dans la console
	process.exit(1); // Quitte le processus avec un code d’erreur (1 = échec)
});