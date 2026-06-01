export type ShopItem = {
    id: number;
    price: number;
    currency: "coins" | "bossTokens";
    amount: number;
};

export type Shop = {
    id: string;
    name: string;
    items: ShopItem[];
};

export type ShopType = "ferragens" | "sementes";
