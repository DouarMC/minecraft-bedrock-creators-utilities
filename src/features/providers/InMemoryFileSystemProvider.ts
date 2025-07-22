import * as vscode from 'vscode';

let instance: InMemoryFileSystemProvider | null = null;

export function registerInMemoryFileSystemProvider(context: vscode.ExtensionContext) {
	const provider = new InMemoryFileSystemProvider();
	instance = provider;

	context.subscriptions.push(
		vscode.workspace.registerFileSystemProvider('molang', provider, {
			isCaseSensitive: true
		})
	);
}

export function getInMemoryFileSystemProvider(): InMemoryFileSystemProvider | null {
	return instance;
}

// Implémente un système de fichiers virtuel (en mémoire uniquement)
export class InMemoryFileSystemProvider implements vscode.FileSystemProvider {
	// Contenu des fichiers, stocké uniquement en mémoire
	private files = new Map<string, Uint8Array>();

	// Événement obligatoire, mais inutilisé ici (donc on crée un événement vide)
	onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = new vscode.EventEmitter<vscode.FileChangeEvent[]>().event;

	/**
	 * Retourne les métadonnées du fichier (statut)
	 * Ici, on génère des valeurs temporaires pour chaque fichier stocké en mémoire
	 */
	stat(uri: vscode.Uri): vscode.FileStat {
		return {
			type: vscode.FileType.File,
			ctime: Date.now(), // création fictive
			mtime: Date.now(), // modification fictive
			size: this.files.get(uri.path)?.length || 0 // taille réelle ou 0
		};
	}

	/**
	 * Lit le contenu du fichier depuis la mémoire.
	 * Si le fichier n'existe pas encore, retourne une chaîne vide.
	 */
	readFile(uri: vscode.Uri): Uint8Array {
		return this.files.get(uri.path) ?? new TextEncoder().encode('');
	}

	/**
	 * Écrit un fichier dans la mémoire (ou le remplace s’il existe déjà)
	 */
	writeFile(uri: vscode.Uri, content: Uint8Array): void {
		this.files.set(uri.path, content);
	}

	/**
	 * Méthode utilitaire pour écrire du texte plus facilement (au lieu de Uint8Array)
	 */
	writeVirtualFile(uri: vscode.Uri, content: string): void {
		this.writeFile(uri, new TextEncoder().encode(content));
	}

	// Méthode obligatoire pour surveiller les fichiers (non utilisée ici)
	watch(): vscode.Disposable {
		return { dispose() {} };
	}

	// Retourne une liste vide : pas de gestion de dossiers
	readDirectory(): [string, vscode.FileType][] {
		return [];
	}

	// Méthodes obligatoires mais vides, car on ne gère pas les dossiers
	createDirectory(): void {}
	delete(): void {}
	rename(): void {}
}