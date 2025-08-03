import Ajv from 'ajv';
import { DynamicExamplesProvider } from './dynamicExamplesProvider';
import { MolangService } from './molangService';

export class CustomKeywords {
    private dynamicExamplesProvider: DynamicExamplesProvider;

    constructor(dynamicExamplesProvider: DynamicExamplesProvider) {
        this.dynamicExamplesProvider = dynamicExamplesProvider;
    }

    public setupKeywords(ajv: Ajv): void {
        this.addMolangType(ajv);
        this.addDynamicExamplesKeyword(ajv);
    }

    private addMolangType(ajv: Ajv): void {
        // Ajouter un format personnalisé pour molang
        // Fonctionne avec type: ["string", "number", "boolean"], format: "molang"
        // Seules les strings seront validées avec la syntaxe Molang
        ajv.addFormat('molang', {
            type: 'string',
            validate: (data: string) => {
                return MolangService.validateMolangSyntax(data);
            }
        });
    }

    private addDynamicExamplesKeyword(ajv: Ajv): void {
        ajv.addKeyword({
            keyword: 'x-dynamic-example-source',
            type: 'string',
            schemaType: ['string', 'array'],
            compile: (schemaValue: string | string[]) => {
                return async function validate(data: any) {
                    // Ce keyword ne fait pas de validation, juste de la métadonnée
                    // Il sera utilisé par les providers pour l'autocomplétion
                    return true;
                };
            },
            metaSchema: {
                oneOf: [
                    { type: 'string' },
                    { type: 'array', items: { type: 'string' } }
                ]
            }
        });
    }
}