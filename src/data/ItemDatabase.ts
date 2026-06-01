import { type Item } from "../types/ItemData";

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
};
