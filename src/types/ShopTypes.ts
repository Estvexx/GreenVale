export type ShopItem = {
    id?: number;
    skinId?: string;
    price: number;
    currency: "coins" | "bossTokens";
    amount: number;
};

export type Shop = {
    id: string;
    name: string;
    nameKey?: string;
    mode: "buy" | "sell";
    items: ShopItem[];
};

export type ShopType = "ferragens" | "sementes" | "mercado" | "upgrades";
