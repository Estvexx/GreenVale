export type ShopType = "ferragens" | "sementes" | "mercado";

export interface ShopItem {
    id: string;
    name: string;
    icon: string;
    price: number;
    maxStack: number;
    isActive: boolean;
}

export const SHOP_DATA: Record<ShopType, ShopItem[]> = {
    ferragens: [
        {
            id: "hoe",
            name: "Enxada",
            icon: "enxada",
            price: 50,
            maxStack: 1,
            isActive: true,
        },
        {
            id: "scythe",
            name: "Foice",
            icon: "foice",
            price: 75,
            maxStack: 1,
            isActive: true,
        },
        {
            id: "empty_bucket",
            name: "Balde Vazio",
            icon: "balde_vazio",
            price: 30,
            maxStack: 99,
            isActive: true,
        },
    ],
    sementes: [
        {
            id: "seed_wheat",
            name: "Semente Trigo",
            icon: "seed_wheat",
            price: 10,
            maxStack: 99,
            isActive: true,
        },
        {
            id: "seed_carrot",
            name: "Semente Cenoura",
            icon: "seed_carrot",
            price: 15,
            maxStack: 99,
            isActive: true,
        },
        {
            id: "seed_tomato",
            name: "Semente Tomate",
            icon: "seed_tomato",
            price: 20,
            maxStack: 99,
            isActive: true,
        },
    ],
    mercado: [],
};
