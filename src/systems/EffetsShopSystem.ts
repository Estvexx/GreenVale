import { MoneySystem } from "./MoneySystem";
import { EffectSystem } from "./EffectsSystem";
import { EFFECT_SHOP_ITEMS } from "../data/shops/effectsShop";

export type EffectBuyResult = "success" | "no_money" | "invalid_effect";

export class EffectShopSystem {
    private static instance: EffectShopSystem;

    private money = MoneySystem.getInstance();
    private effects = EffectSystem.getInstance();

    static getInstance(): EffectShopSystem {
        if (!this.instance) {
            this.instance = new EffectShopSystem();
        }

        return this.instance;
    }

    buy(action: string): EffectBuyResult {
        const shopItem = EFFECT_SHOP_ITEMS[action];

        if (!shopItem) {
            console.warn("Efeito não encontrado:", action);
            return "invalid_effect";
        }

        const paid = this.money.spend(shopItem.currency, shopItem.price);

        if (!paid) {
            return "no_money";
        }

        const effect = {
            ...shopItem.effect,
            expiresAt: shopItem.effect.permanent
                ? undefined
                : Date.now() + (shopItem.durationMs ?? 0),
        };

        this.effects.addEffect(effect);

        return "success";
    }
}
