import { ITEM_IDS } from "./ItemDatabase";

export type ToolSkin = {
    id: string;
    targetItemIds: number[];
    name: string;
    nameKey?: string;
    price: number;
    icon?: string;
    icons?: Record<number, string>;
};

export const TOOL_SKINS: Record<string, ToolSkin> = {
    hoe_gold: {
        id: "hoe_gold",
        targetItemIds: [1],
        name: "Enxada Dourada",
        nameKey: "toolSkins.hoeGold.name",
        price: 100,
        icon: "assets/images/tools/Skins/Enxada_SKIN.png",
    },

    scythe_gold: {
        id: "scythe_gold",
        targetItemIds: [2],
        name: "Foice Dourada",
        nameKey: "toolSkins.scytheGold.name",
        price: 100,
        icon: "assets/images/tools/Skins/Foice_SKIN.png",
    },

    bucket_gold: {
        id: "bucket_gold",
        targetItemIds: [ITEM_IDS.BUCKET_EMPTY, ITEM_IDS.BUCKET_WATER],
        name: "Balde Azul",
        nameKey: "toolSkins.bucketBlue.name",
        price: 100,
        icons: {
            [ITEM_IDS.BUCKET_EMPTY]:
                "assets/images/tools/Skins/Balde_Vazio_SKIN1.png",
            [ITEM_IDS.BUCKET_WATER]:
                "assets/images/tools/Skins/Balde_Agua_SKIN1.png",
        },
    },

    bucket_lava: {
        id: "bucket_lava",
        targetItemIds: [ITEM_IDS.BUCKET_EMPTY, ITEM_IDS.BUCKET_WATER],
        name: "Balde Lava",
        nameKey: "toolSkins.bucketLava.name",
        price: 100,
        icons: {
            [ITEM_IDS.BUCKET_EMPTY]:
                "assets/images/tools/Skins/Balde_Vazio_SKIN2.png",
            [ITEM_IDS.BUCKET_WATER]:
                "assets/images/tools/Skins/Balde_Agua_SKIN2.png",
        },
    },
};
