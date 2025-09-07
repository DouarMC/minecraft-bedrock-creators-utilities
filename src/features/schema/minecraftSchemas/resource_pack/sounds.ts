import { dynamicExamplesSourceKeys } from "../../utils/shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../../types/minecraftJsonSchema";
import { VersionedSchema } from "../../model/versioning";

const baseSchema: MinecraftJsonSchema = {
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
                        description: "Les sons à jouer pour chaque contexte.",
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
        entity_sounds: {
            description: "Applique des sons aux entités.",
            type: "object",
            properties: {
                defaults: {
                    description: "Les sons par défaut pour toutes les entités.",
                    type: "object",
                    properties: {
                        pitch: {
                            description: "Le pitch du son par défaut pour tous les contextes.",
                            oneOf: [
                                {
                                    type: "number"
                                },
                                {
                                    type: "array",
                                    minItems: 2,
                                    maxItems: 2,
                                    items: {
                                        type: "number"
                                    }
                                }
                            ]
                        },
                        volume: {
                            description: "Le volume du son par défaut pour tous les contextes.",
                            type: "number"
                        },
                        events: {
                            description: "Les sons à jouer pour chaque contexte.",
                            type: "object",
                            properties: {
                                activate: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "add.chest": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                admire: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                agitated: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                ambient: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "ambient.aggressive": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "ambient.baby": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "ambient.in.air": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "ambient.in.raid": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "ambient.pollinate": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "ambient.screamer": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "ambient.tame": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "ambient.worried": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                angry: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                armor: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "armor.equip_generic": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "armor.unequip_generic": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                attach: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                attack: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "attack.nodamage": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "attack.strong": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                boost: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "break.block": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                breathe: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                cant_breed: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "cast.spell": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                celebrate: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                charge: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                deactivate: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                death: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "death.baby": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "death.in.water": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "death.mid.volume": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "death.min.volume": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "death.screamer": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "death.to.zombie": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                detach: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                disappeared: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                drink: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "drink.honey": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "drink.milk": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                eat: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "elderguardian.curse": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                explode: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "fall.big": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "fall.small": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                fang: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                fizz: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                flap: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                flop: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                fly: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                freeze: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                fuse: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                growl: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                haggle: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "haggle.no": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "haggle.yes": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                heartbeat: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                hurt: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "hurt.baby": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "hurt.in.water": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "hurt.reduced": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "hurt.screamer": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.blaze": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.bogged": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.breeze": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.cave_spider": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.creaking": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.creeper": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.drowned": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.elder_guardian": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.ender_dragon": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.enderman": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.endermite": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.evocation_illager": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.ghast": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.guardian": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.happy_ghast": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.husk": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.magma_cube": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.phantom": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.pillager": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.polar_bear": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.ravager": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.shulker": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.silverfish": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.skeleton": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.slime": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.spider": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.stray": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.vex": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.vindication_illager": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.warden": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.witch": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.wither": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.wither_skeleton": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.wolf": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.zoglin": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.zombie": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.zombie_pigman": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "imitate.zombie_villager": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "irongolem.crack": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "irongolem.repair": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                jump_to_block: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                listening: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                listening_angry: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                mad: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "mob.warning": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                nearby_close: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                nearby_closer: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                nearby_closest: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                panic: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                pant: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                plop: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "prepare.attack": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "prepare.summon": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "prepare.wololo": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                presneeze: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                purr: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                purreow: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                reappeared: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                reflect: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                retreat: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                roar: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                saddle: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                screech: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                shake: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                shoot: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "shulker.close": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "shulker.open": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                sleep: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                sneeze: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                spawn: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                splash: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "squish.big": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "squish.small": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                stare: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                "step.baby": {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                step_lava: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                stun: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                step_sand: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                swin: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                swoop: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                takeoff: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                tempt: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                throw: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                thunder: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                unfreeze: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                unsaddle: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                warn: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                                whine: {
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
                                                    oneOf: [
                                                        {
                                                            type: "number"
                                                        },
                                                        {
                                                            type: "array",
                                                            minItems: 2,
                                                            maxItems: 2,
                                                            items: {
                                                                type: "number"
                                                            }
                                                        }
                                                    ]
                                                },
                                                volume: {
                                                    description: "Le volume du son.",
                                                    type: "number"
                                                }
                                            }
                                        }
                                    ]
                                },
                            }
                        }
                    }
                },
                entities: {
                    description: "Contient les références de sons d'entités pour chaque type d'entité.",
                    type: "object",
                    propertyNames: {
                        "x-dynamic-examples-source": [dynamicExamplesSourceKeys.entity_ids, dynamicExamplesSourceKeys.vanilla_entity_ids_without_namespace]
                    },
                    additionalProperties: {
                        type: "object",
                        properties: {
                            pitch: {
                                description: "Le pitch du son par défaut pour tous les contextes.",
                                oneOf: [
                                    {
                                        type: "number"
                                    },
                                    {
                                        type: "array",
                                        minItems: 2,
                                        maxItems: 2,
                                        items: {
                                            type: "number"
                                        }
                                    }
                                ]
                            },
                            volume: {
                                description: "Le volume du son par défaut pour tous les contextes.",
                                type: "number"
                            },
                            events: {
                                $ref: "#/properties/entity_sounds/properties/defaults/properties/events"
                            },
                            variants: {
                                description: "Les variantes de sons pour cette entité.",
                                type: "object",
                                required: ["key", "map"],
                                properties: {
                                    key: {
                                        description: "Expression Molang pour déterminer la variante à utiliser.",
                                        type: "molang"
                                    },
                                    map: {
                                        description: "Map des variantes possibles.",
                                        type: "object",
                                        additionalProperties: {
                                            description: "",
                                            $ref: "#/properties/entity_sounds/properties/defaults"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        individual_event_sounds: {
            type: "object",
            properties: {
                events: {
                    type: "object",
                    propertyNames: {
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_individual_event_sound_references
                    },
                    additionalProperties: {
                        type: "object",
                        properties: {
                            pitch: {
                                description: "Le pitch du son.",
                                oneOf: [
                                    {
                                        type: "number"
                                    },
                                    {
                                        type: "array",
                                        minItems: 2,
                                        maxItems: 2,
                                        items: {
                                            type: "number"
                                        }
                                    }
                                ]
                            },
                            volume: {
                                description: "Le volume du son.",
                                type: "number"
                            },
                            sound: {
                                description: "La référence de son à jouer.",
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                            }
                        }
                    }
                }
            }
        },
        individual_named_sounds: {
            type: "object",
            properties: {
                sounds: {
                    type: "object",
                    propertyNames: {
                        "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_individual_named_sound_references
                    },
                    additionalProperties: {
                        type: "object",
                        properties: {
                            pitch: {
                                description: "Le pitch du son.",
                                oneOf: [
                                    {
                                        type: "number"
                                    },
                                    {
                                        type: "array",
                                        minItems: 2,
                                        maxItems: 2,
                                        items: {
                                            type: "number"
                                        }
                                    }
                                ]
                            },
                            volume: {
                                description: "Le volume du son.",
                                type: "number"
                            },
                            sound: {
                                description: "La référence de son à jouer.",
                                type: "string",
                                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
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
                                description: "Les sons à jouer pour chaque contexte.",
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
                },
                entity_sounds: {
                    description: "Les sons de contextes interactifs pour les entités.",
                    type: "object",
                    properties: {
                        defaults: {
                            description: "Les sons par défaut pour tous les types d'entités.",
                            type: "object",
                            properties: {
                                pitch: {
                                    description: "Le pitch du son par défaut pour tous les contextes.",
                                    oneOf: [
                                        {
                                            type: "number"
                                        },
                                        {
                                            type: "array",
                                            minItems: 2,
                                            maxItems: 2,
                                            items: {
                                                type: "number"
                                            }
                                        }
                                    ]
                                },
                                volume: {
                                    description: "Le volume du son par défaut pour tous les contextes.",
                                    type: "number"
                                },
                                events: {
                                    description: "Les sons à jouer pour chaque contexte.",
                                    oneOf: [
                                        {
                                            type: "string",
                                            "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
                                        },
                                        {
                                            type: "object"
                                        }
                                    ]
                                }
                            }
                        },
                        entities: {
                            type: "object",
                            propertyNames: {
                                "x-dynamic-examples-source": [dynamicExamplesSourceKeys.entity_ids, dynamicExamplesSourceKeys.vanilla_entity_ids_without_namespace]
                            },
                            additionalProperties: {
                                type: "object"
                            }
                        }
                    }
                }
            }
        }
    }
};

export const soundsSchemaTypeRP: VersionedSchema = {
    fileMatch: ["**/addon/resource_pack/sounds.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};