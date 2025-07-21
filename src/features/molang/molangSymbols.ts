import { MolangSymbol } from "../../types/molang";

export const molangSymbols: MolangSymbol[] = [
    {
        kind: "math",
        name: "abs",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "any",
                description: "La valeur dont on veut obtenir la valeur absolue."
            }
        ],
        description: "Renvoie la valeur absolue d'un nombre.",
        examples: ["math.abs(-3) // => 3"]
    }
];
