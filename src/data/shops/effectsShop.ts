import type { Effect } from "../../types/Effect";

export type EffectShopItem = {
    action: string;
    price: number;
    currency: "bossTokens";
    durationMs?: number;
    potionIcon: string;
    currencyIcon: string;
    effect: Omit<Effect, "expiresAt">;
};

export const EFFECT_SHOP_ITEMS: Record<string, EffectShopItem> = {
    speed: {
        action: "speed",
        price: 2,
        currency: "bossTokens",
        durationMs: 5 * 60 * 1000,
        potionIcon: "assets/images/potions/Potion_of_speed.png",
        currencyIcon: "assets/images/Boss_Coin.png",
        effect: {
            id: "speed",
            name: "Poção de Velocidade",
            description: "+20% velocidade",
            icon: "speed",
            permanent: false,
        },
    },

    damage: {
        action: "damage",
        price: 5,
        currency: "bossTokens",
        potionIcon: "assets/images/potions/Potion_of_damage.png",
        currencyIcon: "assets/images/Boss_Coin.png",
        effect: {
            id: "damage",
            name: "Poção de Dano",
            description: "+10% dano permanente",
            icon: "damage",
            permanent: true,
        },
    },

    growth: {
        action: "growth",
        price: 3,
        currency: "bossTokens",
        durationMs: 10 * 60 * 1000,
        potionIcon: "assets/images/potions/Potion_of_growth.png",
        currencyIcon: "assets/images/Boss_Coin.png",
        effect: {
            id: "growth",
            name: "Poção de Crescimento",
            description: "+25% crescimento das plantas",
            icon: "growth",
            permanent: false,
        },
    },

    seed_discount: {
        action: "seed_discount",
        price: 3,
        currency: "bossTokens",
        durationMs: 10 * 60 * 1000,
        potionIcon: "assets/images/potions/Potion_of_discount.png",
        currencyIcon: "assets/images/Boss_Coin.png",
        effect: {
            id: "seed_discount",
            name: "Desconto de Sementes",
            description: "-15% em sementes",
            icon: "seed_discount",
            permanent: false,
        },
    },
};
