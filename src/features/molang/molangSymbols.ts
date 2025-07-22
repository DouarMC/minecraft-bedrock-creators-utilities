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
    },
    {
        kind: "math",
        name: "acos",
        description: "Renvoie L'arc cosinus (ou arccos) d'un nombre, c'est-à-dire l'angle dont le cosinus vaut ce nombre.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "number",
                description: "Le nombre dont on veut obtenir l'arc cosinus."
            }
        ],
        examples: ["math.acos(0) // => 1.5707963267948966"]
    },
    {
        kind: "math",
        name: "asin",
        description: "Renvoie l'arc sinus (ou arcsin) d'un nombre, c'est-à-dire l'angle dont le sinus vaut ce nombre.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "number",
                description: "Le nombre dont on veut obtenir l'arc sinus."
            }
        ],
        examples: ["math.asin(0) // => 0"]
    },
    {
        kind: "math",
        name: "atan",
        description: "Renvoie l'arc tangente (ou arctan) d'un nombre, c'est-à-dire l'angle dont la tangente vaut ce nombre.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "number",
                description: "Le nombre dont on veut obtenir l'arc tangente."
            }
        ],
        examples: ["math.atan(0) // => 0"]
    },
    {
        kind: "math",
        name: "atan2",
        description: "Renvoie l'arc tangente (ou arctan) d'un vecteur (y, x). C'est l'angle dont la tangente vaut y/x.",
        returnType: "number",
        parameters: [
            {
                name: "y",
                type: "number",
                description: "La composante y du vecteur."
            },
            {
                name: "x",
                type: "number",
                description: "La composante x du vecteur."
            }
        ],
        examples: ["math.atan2(1, 0) // => 1.5707963267948966"]
    },
    {
        kind: "math",
        name: "ceil",
        description: "Renvoie le plus petit entier supérieur ou égal à un nombre.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "any",
                description: "Le nombre dont on veut obtenir le plafond."
            }
        ],
        examples: ["math.ceil(3.14) // => 4"]
    },
    {
        kind: "math",
        name: "clamp",
        description: "Renvoie une valeur limitée à un intervalle donné. Si la valeur est inférieure au minimum, elle renvoie le minimum. Si elle est supérieure au maximum, elle renvoie le maximum. Sinon, elle renvoie la valeur.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "any",
                description: "La valeur à limiter."
            },
            {
                name: "min",
                type: "any",
                description: "La valeur minimale de l'intervalle."
            },
            {
                name: "max",
                type: "any",
                description: "La valeur maximale de l'intervalle."
            }
        ],
        examples: ["math.clamp(5, 1, 10) // => 5", "math.clamp(0, 1, 10) // => 1", "math.clamp(15, 1, 10) // => 10"]
    },
    {
        kind: "math",
        name: "cos",
        description: "Renvoie le cosinus d'un angle exprimé en radians.",
        returnType: "number",
        parameters: [
            {
                name: "angle",
                type: "number",
                description: "L'angle en radians dont on veut obtenir le cosinus."
            }
        ],
        examples: ["math.cos(0) // => 1"]
    },
    {
        kind: "math",
        name: "die_roll",
        description: "Renvoie la somme de `num` nombres aléatoires, chacun ayant une valeur entre `low` et `high`. Note : les nombres aléatoires générés ne sont pas des entiers comme les dés normaux. Pour cela, utilisez `math.die_roll_integer`.",
        returnType: "number",
        parameters: [
            {
                name: "num",
                type: "number",
                description: "Le nombre de dés à lancer."
            },
            {
                name: "low",
                type: "number",
                description: "La valeur minimale d'un dé."
            },
            {
                name: "high",
                type: "number",
                description: "La valeur maximale d'un dé."
            }
        ],
        examples: ["math.die_roll(2, 1, 6) // => 7 (par exemple)"]
    },
    {
        kind: "math",
        name: "die_roll_integer",
        description: "Renvoie la somme de `num` nombres aléatoires, chacun ayant une valeur entière entre `low` et `high`. Note : les nombres aléatoires générés sont des entiers comme un dé normal.",
        returnType: "number",
        parameters: [
            {
                name: "num",
                type: "number",
                description: "Le nombre de dés à lancer."
            },
            {
                name: "low",
                type: "number",
                description: "La valeur minimale d'un dé."
            },
            {
                name: "high",
                type: "number",
                description: "La valeur maximale d'un dé."
            }
        ],
        examples: ["math.die_roll_integer(2, 1, 6) // => 7 (par exemple)"]
    },
    {
        kind: "math",
        name: "exp",
        description: "Renvoie la valeur de e (la base des logarithmes naturels) élevée à la puissance d'un nombre.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "number",
                description: "La puissance à laquelle élever e."
            }
        ],
        examples: ["math.exp(1) // => 2.718281828459045"]
    },
    {
        kind: "math",
        name: "hermite_blend",
        description: "Renvoie la valeur d'une interpolation de Hermite, qui est une fonction de base utilisée pour l'interpolation de courbes.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "number",
                description: "La valeur à interpoler, généralement entre 0 et 1."
            }
        ],
        examples: ["math.hermite_blend(0.5) // => 0.5"]
    },
    {
        kind: "math",
        name: "lerp",
        description: "Effectue une interpolation linéaire entre deux valeurs. Le facteur d'interpolation se fait entre 0 et 1.",
        returnType: "number",
        parameters: [
            {
                name: "start",
                type: "number",
                description: "La valeur de départ de l'interpolation."
            },
            {
                name: "end",
                type: "number",
                description: "La valeur de fin de l'interpolation."
            },
            {
                name: "0_to_1",
                type: "number",
                description: "Le facteur d'interpolation entre 0 et 1. 0 correspond à la valeur de départ, 1 à la valeur de fin."
            }
        ],
        examples: ["math.lerp(0, 10, 0.5) // => 5", "math.lerp(0, 10, 1) // => 10", "math.lerp(0, 10, 0) // => 0"]
    },
    {
        kind: "math",
        name: "lerprotate",
        description: "Effectue une interpolation entre deux angles (en degrés) en suivant le chemin le plus court sur un cercle, avec un facteur t entre 0 et 1.",
        returnType: "number",
        parameters: [
            {
                name: "start",
                type: "number",
                description: "L'angle de départ en degrés."
            },
            {
                name: "end",
                type: "number",
                description: "L'angle de fin en degrés."
            },
            {
                name: "0_to_1",
                type: "number",
                description: "Le facteur d'interpolation entre 0 et 1. 0 correspond à l'angle de départ, 1 à l'angle de fin."
            }
        ],
        examples: ["math.lerprotate(0, 180, 0.5) // => 90", "math.lerprotate(350, 10, 0.5) // => 0"]
    },
    {
        kind: "math",
        name: "ln",
        description: "Renvoie le logarithme naturel (base e) d'un nombre.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "number",
                description: "Le nombre dont on veut obtenir le logarithme naturel."
            }
        ],
    },
    {
        kind: "math",
        name: "max",
        description: "Renvoie la valeur maximale entre 2 valeurs.",
        returnType: "number",
        parameters: [
            {
                name: "A",
                type: "number",
                description: "La première valeur à comparer."
            },
            {
                name: "B",
                type: "number",
                description: "La deuxième valeur à comparer."
            }
        ],
        examples: ["math.max(5, 10) // => 10", "math.max(10, 5) // => 10"]
    },
    {
        kind: "math",
        name: "min",
        description: "Renvoie la valeur minimale entre 2 valeurs.",
        returnType: "number",
        parameters: [
            {
                name: "A",
                type: "number",
                description: "La première valeur à comparer."
            },
            {
                name: "B",
                type: "number",
                description: "La deuxième valeur à comparer."
            }
        ],
        examples: ["math.min(5, 10) // => 5", "math.min(10, 5) // => 5"]
    },
    {
        kind: "math",
        name: "min_angle",
        description: "Ramène un angle (en degrés) dans la plage [-180°, 180°).",
        returnType: "number",
        parameters: [
            {
                name: "angle",
                type: "number",
                description: "L'angle à ramener dans la plage [-180°, 180°)."
            }
        ],
        examples: ["math.min_angle(190) // => -170", "math.min_angle(-190) // => 170"]
    },
    {
        kind: "math",
        name: "mod",
        description: "Renvoie le reste de la division entre la valeur et le dénominateur.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "number",
                description: "La valeur à diviser."
            },
            {
                name: "denominator",
                type: "number",
                description: "Le dénominateur de la division."
            }
        ],
        examples: ["math.mod(10, 3) // => 1", "math.mod(10, 5) // => 0"]
    },
    {
        kind: "math",
        name: "pi",
        description: "Renvoie la valeur de pi (π), qui est le rapport de la circonférence d'un cercle à son diamètre.",
        returnType: "number",
        examples: ["math.pi // => 3.141592653589793"]
    },
    {
        kind: "math",
        name: "pow",
        description: "Renvoie la valeur d'un nombre élevé à une puissance.",
        returnType: "number",
        parameters: [
            {
                name: "base",
                type: "number",
                description: "La base du nombre."
            },
            {
                name: "exponent",
                type: "number",
                description: "L'exposant auquel élever la base."
            }
        ],
        examples: ["math.pow(2, 3) // => 8", "math.pow(5, 2) // => 25"]
    },
    {
        kind: "math",
        name: "random",
        description: "Renvoie un nombre aléatoire compris entre `low` et `high`, inclusivement.",
        returnType: "number",
        parameters: [
            {
                name: "low",
                type: "number",
                description: "La valeur minimale du nombre aléatoire."
            },
            {
                name: "high",
                type: "number",
                description: "La valeur maximale du nombre aléatoire."
            }
        ],
        examples: ["math.random(1, 10) // => 5 (par exemple)", "math.random(0, 1) // => 0.123456789 (par exemple)"]
    },
    {
        kind: "math",
        name: "random_integer",
        description: "Renvoie un nombre entier aléatoire compris entre `low` et `high`, inclusivement.",
        returnType: "number",
        parameters: [
            {
                name: "low",
                type: "number",
                description: "La valeur minimale du nombre entier aléatoire."
            },
            {
                name: "high",
                type: "number",
                description: "La valeur maximale du nombre entier aléatoire."
            }
        ],
        examples: ["math.random_integer(1, 10) // => 5 (par exemple)", "math.random_integer(0, 1) // => 0 (par exemple)"]
    },
    {
        kind: "math",
        name: "round",
        description: "Renvoie le nombre arrondi à l'entier le plus proche.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "any",
                description: "Le nombre à arrondir."
            }
        ],
        examples: ["math.round(3.14) // => 3", "math.round(3.5) // => 4"]
    },
    {
        kind: "math",
        name: "sin",
        description: "Renvoie le sinus d'un angle exprimé en radians.",
        returnType: "number",
        parameters: [
            {
                name: "angle",
                type: "number",
                description: "L'angle en radians dont on veut obtenir le sinus."
            }
        ],
        examples: ["math.sin(0) // => 0"]
    },
    {
        kind: "math",
        name: "sqrt",
        description: "Renvoie la racine carrée d'un nombre.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "any",
                description: "Le nombre dont on veut obtenir la racine carrée."
            }
        ],
        examples: ["math.sqrt(4) // => 2", "math.sqrt(9) // => 3"]
    },
    {
        kind: "math",
        name: "trunc",
        description: "Renvoie la partie entière d'un nombre, en supprimant la partie décimale.",
        returnType: "number",
        parameters: [
            {
                name: "value",
                type: "any",
                description: "Le nombre dont on veut obtenir la partie entière."
            }
        ],
        examples: ["math.trunc(3.14) // => 3", "math.trunc(-3.14) // => -3"]
    }
];
