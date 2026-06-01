import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";
import { type Shop, type ShopType } from "../types/ShopTypes";
import { FERRAGENS_SHOP, SEMENTES_SHOP } from "../data/ShopData";

export class ShopSystem {
    private static instance: ShopSystem;

    static getInstance() {
        if (!this.instance) this.instance = new ShopSystem();
        return this.instance;
    }

    private shops: Record<ShopType, Shop> = {
        ferragens: FERRAGENS_SHOP,
        sementes: SEMENTES_SHOP,
    };

    private currentShop: Shop | null = null;

    open(type: ShopType) {
        this.currentShop = this.shops[type];
        return this.currentShop;
    }

    close() {
        this.currentShop = null;
    }

    getCurrentShop() {
        return this.currentShop;
    }

    buy(itemId: number) {
        if (!this.currentShop) return false;

        const item = this.currentShop.items.find((i) => i.id === itemId);
        if (!item) return false;

        const money = MoneySystem.getInstance();
        const inv = InventorySystem.getInstance();

        const success = money.spend(item.currency, item.price);
        if (!success) return false;

        inv.addItem(item.id, item.amount);

        return true;
    }
}
