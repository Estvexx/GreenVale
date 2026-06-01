import { type Item } from "../types/ItemData";

export const ITEM_IDS = {
    BUCKET_EMPTY: 3,
    BUCKET_WATER: 4,
};

export const ITEMS: Record<number, Item> = {
    1: {
        id: 1,
        name: "Enxada",
        icon: "assets/images/tools/Enxada.png",
        maxStack: 1,
        maxSlots: 1,
        description: "Ferramenta para cultivar terreno",
    },

    2: {
        id: 2,
        name: "Foice",
        icon: "assets/images/tools/Foice.png",
        maxStack: 1,
        maxSlots: 1,
        description: "Usada para colher plantações",
    },

    3: {
        id: 3,
        name: "Balde Vazio",
        icon: "assets/images/tools/Balde_Vazio.png",
        maxStack: 10,
        maxSlots: 1,
        description: "Utilizado para lubrificar o terreno e regar as plantas",
    },
    4: {
        id: 4,
        name: "Balde Cheio",
        icon: "assets/images/tools/Balde_Agua.png",
        maxStack: 1,
        maxSlots: 30,
        description: "Utilizado para lubrificar o terreno e regar as plantas",
    },

    10: {
        id: 10,
        name: "Uvas",
        spritesheet: "assets/images/Fruits.png",
        frame: 0,
        maxStack: 99,
        maxSlots: 10,
        description: "Após ser coletada, pode ser vendida para ganhar moedas",
    },
    11: {
        id: 11,
        name: "Pepino",
        spritesheet: "assets/images/Fruits.png",
        frame: 1,
        maxStack: 99,
        maxSlots: 10,
        description: "Após ser coletada, pode ser vendida para ganhar moedas",
    },
    12: {
        id: 12,
        name: "Pimenta",
        spritesheet: "assets/images/Fruits.png",
        frame: 2,
        maxStack: 99,
        maxSlots: 10,
        description: "Após ser coletada, pode ser vendida para ganhar moedas",
    },
    13: {
        id: 13,
        name: "Vaga",
        spritesheet: "assets/images/Fruits.png",
        frame: 3,
        maxStack: 99,
        maxSlots: 10,
        description: "Após ser coletada, pode ser vendida para ganhar moedas",
    },
    14: {
        id: 14,
        name: "Ananas",
        spritesheet: "assets/images/Fruits.png",
        frame: 4,
        maxStack: 99,
        maxSlots: 10,
        description: "Após ser coletada, pode ser vendida para ganhar moedas",
    },
    15: {
        id: 15,
        name: "Feijao Verde",
        spritesheet: "assets/images/Fruits.png",
        frame: 5,
        maxStack: 99,
        maxSlots: 10,
        description: "Após ser coletada, pode ser vendida para ganhar moedas",
    },
};
