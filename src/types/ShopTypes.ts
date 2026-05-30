export type ShopItem = {
    id: number;
    name: string;
    price: number;
    icon: string;
    currency: "coins" | "bossTokens";
    amount: number;
};

export type Shop = {
    id: string;
    name: string;
    items: ShopItem[];
};

export type ShopType = "ferragens" | "sementes";
