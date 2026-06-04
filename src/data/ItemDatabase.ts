import { type Item } from "../types/ItemData";

export const ITEM_IDS = {
    BUCKET_EMPTY: 3,
    BUCKET_WATER: 4,
};

export const ITEMS: Record<number, Item> = {
    1: {
        id: 1,
        name: "Enxada",
        nameKey: "items.hoe.name",
        icon: "assets/images/tools/Enxada.png",
        maxStack: 1,
        maxSlots: 1,
        description:
            "Ferramenta essencial para preparar a terra antes de plantar.",
        descriptionKey: "items.hoe.description",
    },

    2: {
        id: 2,
        name: "Foice",
        nameKey: "items.scythe.name",
        icon: "assets/images/tools/Foice.png",
        maxStack: 1,
        maxSlots: 1,
        description:
            "Ideal para colher plantações maduras e limpar ervas do campo.",
        descriptionKey: "items.scythe.description",
    },

    3: {
        id: 3,
        name: "Balde Vazio",
        nameKey: "items.bucketEmpty.name",
        icon: "assets/images/tools/Balde_Vazio.png",
        maxStack: 10,
        maxSlots: 1,
        description:
            "Um balde vazio. Pode ser enchido no poço para transportar água.",
        descriptionKey: "items.bucketEmpty.description",
    },

    4: {
        id: 4,
        name: "Balde com Água",
        nameKey: "items.bucketWater.name",
        icon: "assets/images/tools/Balde_Agua.png",
        maxStack: 1,
        maxSlots: 30,
        description:
            "Balde cheio de água. Útil para regar plantações ou abastecer ferramentas.",
        descriptionKey: "items.bucketWater.description",
    },

    5: {
        id: 5,
        name: "Tesoura",
        nameKey: "items.scissors.name",
        icon: "assets/images/tools/Espada_1.png",
        maxStack: 1,
        maxSlots: 1,
        damage: 5,
        description: "Uma arma improvisada e leve. Causa 5 de dano.",
        descriptionKey: "items.scissors.description",
    },

    6: {
        id: 6,
        name: "Bastão",
        nameKey: "items.stick.name",
        icon: "assets/images/tools/Espada_2.png",
        maxStack: 1,
        maxSlots: 1,
        damage: 10,
        description:
            "Um bastão resistente, simples mas eficaz contra criaturas. Causa 10 de dano.",
        descriptionKey: "items.stick.description",
    },

    7: {
        id: 7,
        name: "Taco de Basebol",
        nameKey: "items.baseballBat.name",
        icon: "assets/images/tools/Espada_3.png",
        maxStack: 1,
        maxSlots: 1,
        damage: 15,
        description: "Um taco pesado com bom impacto. Causa 15 de dano.",
        descriptionKey: "items.baseballBat.description",
    },

    8: {
        id: 8,
        name: "Espada Dourada",
        nameKey: "items.goldenSword.name",
        icon: "assets/images/tools/Espada_4.png",
        maxStack: 1,
        maxSlots: 1,
        damage: 25,
        description:
            "Uma espada rara e afiada, feita para enfrentar bosses. Causa 25 de dano.",
        descriptionKey: "items.goldenSword.description",
    },

    9: {
        id: 9,
        name: "Lança dos Deuses",
        nameKey: "items.godSpear.name",
        icon: "assets/images/tools/Espada_5.png",
        maxStack: 1,
        maxSlots: 1,
        damage: 40,
        description: "Uma arma lendária com poder divino. Causa 40 de dano.",
        descriptionKey: "items.godSpear.description",
    },

    10: {
        id: 10,
        name: "Semente de Uvas",
        nameKey: "items.grapeSeed.name",
        spritesheet: "assets/images/Fruits.png",
        col: 0,
        row: 1,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Semente de uvas. Planta-a em terra preparada para produzir uvas.",
        descriptionKey: "items.grapeSeed.description",
    },

    11: {
        id: 11,
        name: "Semente de Pepino",
        nameKey: "items.cucumberSeed.name",
        spritesheet: "assets/images/Fruits.png",
        col: 1,
        row: 1,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Semente de pepino. Uma boa escolha para uma colheita simples e rentável.",
        descriptionKey: "items.cucumberSeed.description",
    },

    12: {
        id: 12,
        name: "Semente de Pimenta",
        nameKey: "items.pepperSeed.name",
        spritesheet: "assets/images/Fruits.png",
        col: 2,
        row: 1,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Semente de pimenta. Produz uma colheita picante com bom valor de venda.",
        descriptionKey: "items.pepperSeed.description",
    },

    13: {
        id: 13,
        name: "Semente de Vagem",
        nameKey: "items.greenBeanSeed.name",
        spritesheet: "assets/images/Fruits.png",
        col: 3,
        row: 1,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Semente de vagem. Ideal para expandir a produção agrícola.",
        descriptionKey: "items.greenBeanSeed.description",
    },

    14: {
        id: 14,
        name: "Semente de Ananás",
        nameKey: "items.pineappleSeed.name",
        spritesheet: "assets/images/Fruits.png",
        col: 4,
        row: 1,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Semente de ananás. Demora mais, mas pode render uma colheita valiosa.",
        descriptionKey: "items.pineappleSeed.description",
    },

    15: {
        id: 15,
        name: "Semente de Feijão Verde",
        nameKey: "items.greenPeaSeed.name",
        spritesheet: "assets/images/Fruits.png",
        col: 5,
        row: 1,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Semente de feijão verde. Boa para manter uma produção constante.",
        descriptionKey: "items.greenPeaSeed.description",
    },

    20: {
        id: 20,
        name: "Uvas",
        nameKey: "items.grapes.name",
        spritesheet: "assets/images/Fruits.png",
        col: 0,
        row: 0,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Uvas frescas colhidas da quinta. Podem ser vendidas por moedas.",
        descriptionKey: "items.grapes.description",
    },

    21: {
        id: 21,
        name: "Pepino",
        nameKey: "items.cucumber.name",
        spritesheet: "assets/images/Fruits.png",
        col: 1,
        row: 0,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Pepino acabado de colher. Simples, fresco e pronto para vender.",
        descriptionKey: "items.cucumber.description",
    },

    22: {
        id: 22,
        name: "Pimenta",
        nameKey: "items.pepper.name",
        spritesheet: "assets/images/Fruits.png",
        col: 2,
        row: 0,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Pimenta intensa e valiosa. Uma boa colheita para ganhar moedas.",
        descriptionKey: "items.pepper.description",
    },

    23: {
        id: 23,
        name: "Vagem",
        nameKey: "items.greenBean.name",
        spritesheet: "assets/images/Fruits.png",
        col: 3,
        row: 0,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Vagem fresca da quinta. Pode ser vendida ou usada em futuras receitas.",
        descriptionKey: "items.greenBean.description",
    },

    24: {
        id: 24,
        name: "Ananás",
        nameKey: "items.pineapple.name",
        spritesheet: "assets/images/Fruits.png",
        col: 4,
        row: 0,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Ananás doce e raro. Uma colheita com excelente valor de venda.",
        descriptionKey: "items.pineapple.description",
    },

    25: {
        id: 25,
        name: "Feijão Verde",
        nameKey: "items.greenPea.name",
        spritesheet: "assets/images/Fruits.png",
        col: 5,
        row: 0,
        maxStack: 99,
        maxSlots: 10,
        description:
            "Feijão verde acabado de colher. Um produto agrícola fiável para vender.",
        descriptionKey: "items.greenPea.description",
    },
};
