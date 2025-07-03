import {
    getLanguageService,
    LanguageService,
    ClientCapabilities,
} from 'vscode-json-languageservice';

// Déclaration des capacités du client (VS Code ou autre éditeur)
// Cela permet de spécifier ce que le client peut afficher ou gérer
const clientCapabilities: ClientCapabilities = {
    textDocument: {
        completion: {
            completionItem: {
                // Le client peut afficher la documentation des éléments de complétion en Markdown ou en texte brut
                documentationFormat: ['markdown', 'plaintext']
            }
        },
        hover: {
            // Le contenu affiché lors d'un survol (hover) peut aussi être en Markdown ou texte brut
            contentFormat: ['markdown', 'plaintext']
        }
    }
};

// Création du service de langage JSON avec les capacités client spécifiées
// Ce service permet ensuite d’analyser, valider, compléter et survoler des documents JSON
const jsonService: LanguageService = getLanguageService({
    clientCapabilities
});

// Export du service JSON pour pouvoir l’utiliser dans d'autres fichiers de l'extension
export default jsonService;