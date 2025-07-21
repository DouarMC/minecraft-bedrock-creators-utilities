export interface MolangParameter {
    name: string;
    type: 'number' | 'boolean' | 'string' | 'any';
    description?: string;
    optional?: boolean;
    variadic?: boolean;
}

export interface MolangSymbol {
    name: string;
    kind: 'query' | 'math' | 'context' | 'variable' | 'temp' | 'animation' | 'geometry' | 'struct' | 'keyword';
    aliases?: string[];
    returnType: 'number' | 'boolean' | 'string' | 'void' | 'any';
    parameters?: MolangParameter[];
    description?: string;
    examples?: string[];
}