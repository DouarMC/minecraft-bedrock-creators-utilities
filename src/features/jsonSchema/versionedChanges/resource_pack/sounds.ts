import { SchemaType } from "../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../shared/schemaEnums";

const baseSchema = {
    description: "Ce fichier sert à crée des références de sons de contextes en utilisant des reférences de sons définies dans le fichier `sound_definitions.json`.",
    type: "object",
    properties: {
        block_sounds: {
            description: "Contient les références de sons de contextes basiques pour les blocs.",
            type: "object",
            propertyNames: {
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_base_block_sound_references
            },
            additionalProperties: {
                type: "object",
                properties: {
                    pitch: {
                        description: "Le pitch du son par défaut pour tous les contextes.",
                        type: "number"
                    },
                    volume: {
                        description: "Le volume du son par défaut pour tous les contextes.",
                        type: "number"
                    },
                    events: {
                        descriprion: "Les sons à jouer pour chaque contexte.",
                        type: "object",
                        properties: {
                            ambient: {
                                description: "Le son joué en continu par le bloc.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "ambient.in.water": {
                                description: "Le son joué en continu par le bloc quand il est dans l'eau.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            break: {
                                description: "Le son joué quand le bloc est cassé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            break_pot: {
                                description: "Le son joué quand le bloc de pot est cassé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            brush: {
                                description: "Le son joué quand le bloc est brossé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            brush_completed: {
                                description: "Le son joué quand le bloc est brossé et que l'action est terminée.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "button.click_off": {
                                description: "Le son joué quand le bouton est relâché.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "button.click_on": {
                                description: "Le son joué quand le bouton est cliqué.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "chest.open": {
                                description: "Le son joué quand le bloc coffre est ouvert.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "chest.closed": {
                                description: "Le son joué quand le bloc coffre est fermé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            close: {
                                description: "Le son joué quand le bloc est fermé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            close_long: {
                                description: "Le son joué quand le bloc est fermé pour une longue durée.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            creaking_heart_spawn: {
                                description: "Le son joué quand le bloc de coeur de creaking apparaît.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            default: {
                                description: "Le son joué par défaut pour les contextes non définis.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "door.close": {
                                description: "Le son joué quand la porte est fermée.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "door.open": {
                                description: "Le son joué quand la porte est ouverte.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            fall: {
                                description: "Le son joué quand une entité tombe sur le bloc. La chute doit être supérieur à 3 blocs.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "fence_gate.close": {
                                description: "Le son joué quand la porte de clôture est fermée.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "fence_gate.open": {
                                description: "Le son joué quand la porte de clôture est ouverte.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            hit: {
                                description: "Le son joué quand le bloc est tapé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            insert: {
                                description: "Le son joué quand un item est inséré dans le bloc.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            insert_enchanted: {
                                description: "Le son joué quand un item enchanté est inséré dans le bloc.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "item.use.on": {
                                description: "Le son joué quand un item est utilisé sur le bloc.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            open: {
                                description: "Le son joué quand le bloc est ouvert.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            open_long: {
                                description: "Le son joué quand le bloc est ouvert pour une longue durée.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            pickup: {
                                description: "Le son joué quand un item est récupéré par le bloc.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            pickup_enchanted: {
                                description: "Le son joué quand un item enchanté est récupéré par le bloc.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            place: {
                                description: "Le son joué quand le bloc est placé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            place_in_water: {
                                description: "Le son joué quand le bloc est placé dans l'eau.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "power.off": {
                                description: "Le son joué quand le bloc est désactivé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "power.on": {
                                description: "Le son joué quand le bloc est activé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "pressure_plate.click_on": {
                                description: "Le son joué quand la plaque de pression est activée.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "pressure_plate.click_off": {
                                description: "Le son joué quand la plaque de pression est désactivée.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            shatter_pot: {
                                description: "Le son joué quand le bloc pot se brise.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            state_change: {
                                description: "Le son joué quand l'état du bloc change.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            step: {
                                description: "Le son joué quand une entité marche sur le bloc.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "trapdoor.close": {
                                description: "Le son joué quand le bloc trappe est fermé.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            },
                            "trapdoor.open": {
                                description: "Le son joué quand le bloc trappe est ouvert.",
                                oneOf: [
                                    {
                                        type: "string",
                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sound: {
                                                description: "La référence de son à jouer.",
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            pitch: {
                                                description: "Le pitch du son.",
                                                type: "number"
                                            },
                                            volume: {
                                                description: "Le volume du son.",
                                                type: "number"
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        interactive_sounds: {
            description: "Contient les références de sons de contextes interactifs.",
            type: "object",
            properties: {
                block_sounds: {
                    description: "Les sons de contextes interactifs pour les blocs.",
                    type: "object",
                    propertyNames: {
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_interactive_block_sound_references
                    },
                    additionalProperties: {
                        type: "object",
                        properties: {
                            pitch: {
                                description: "Le pitch du son par défaut pour tous les contextes.",
                                type: "number"
                            },
                            volume: {
                                description: "Le volume du son par défaut pour tous les contextes.",
                                type: "number"
                            },
                            events: {
                                descriprion: "Les sons à jouer pour chaque contexte.",
                                type: "object",
                                properties: {
                                    fall: {
                                        description: "Le son joué quand une entité tombe sur le bloc. La chute doit être supérieur à 3 blocs.",
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            {
                                                type: "object",
                                                properties: {
                                                    sound: {
                                                        description: "La référence de son à jouer.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                                    },
                                                    pitch: {
                                                        description: "Le pitch du son.",
                                                        type: "number"
                                                    },
                                                    volume: {
                                                        description: "Le volume du son.",
                                                        type: "number"
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    jump: {
                                        description: "Le son joué quand une entité saute sur le bloc.",
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            {
                                                type: "object",
                                                properties: {
                                                    sound: {
                                                        description: "La référence de son à jouer.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                                    },
                                                    pitch: {
                                                        description: "Le pitch du son.",
                                                        type: "number"
                                                    },
                                                    volume: {
                                                        description: "Le volume du son.",
                                                        type: "number"
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    step: {
                                        description: "Le son joué quand une entité marche sur le bloc.",
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            {
                                                type: "object",
                                                properties: {
                                                    sound: {
                                                        description: "La référence de son à jouer.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                                    },
                                                    pitch: {
                                                        description: "Le pitch du son.",
                                                        type: "number"
                                                    },
                                                    volume: {
                                                        description: "Le volume du son.",
                                                        type: "number"
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    land: {
                                        description: "Le son joué quand une entité atterrit sur le bloc. La chute doit être inférieur à 3 blocs.",
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            {
                                                type: "object",
                                                properties: {
                                                    sound: {
                                                        description: "La référence de son à jouer.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                                    },
                                                    pitch: {
                                                        description: "Le pitch du son.",
                                                        type: "number"
                                                    },
                                                    volume: {
                                                        description: "Le volume du son.",
                                                        type: "number"
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    default: {
                                        description: "Le son joué par défaut pour les contextes non définis.",
                                        oneOf: [
                                            {
                                                type: "string",
                                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                            },
                                            {
                                                type: "object",
                                                properties: {
                                                    sound: {
                                                        description: "La référence de son à jouer.",
                                                        type: "string",
                                                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                                    },
                                                    pitch: {
                                                        description: "Le pitch du son.",
                                                        type: "number"
                                                    },
                                                    volume: {
                                                        description: "Le volume du son.",
                                                        type: "number"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const soundsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/sounds.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};