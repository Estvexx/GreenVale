import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";
import { type Shop, type ShopType } from "../types/ShopTypes";
import { FERRAGENS_SHOP } from "../data/shops/ferragensShop";
import { SEMENTES_SHOP } from "../data/shops/sementesShop";
import { MERCADO_SHOP } from "../data/shops/mercadoShop";

export type BuyResult = "success" | "no_money" | "inventory_full";
export type SellResult = "success" | "no_item";

export class ShopSystem {
    private static instance: ShopSystem;

    static getInstance(): ShopSystem {
        if (!this.instance) {
            this.instance = new ShopSystem();
        }

        return this.instance;
    }

    private shops: Record<ShopType, Shop> = {
        ferragens: FERRAGENS_SHOP,
        sementes: SEMENTES_SHOP,
        mercado: MERCADO_SHOP,
    };

    private currentShop: Shop | null = null;

    open(type: ShopType): Shop | null {
        this.currentShop = this.shops[type] ?? null;
        return this.currentShop;
    }

    close() {
        this.currentShop = null;
    }

    getCurrentShop(): Shop | null {
        return this.currentShop;
    }

    buy(itemId: number): BuyResult {
        const item = this.currentShop?.items.find((i) => i.id === itemId);

        if (!item) return "inventory_full";

        const money = MoneySystem.getInstance();
        const inventory = InventorySystem.getInstance();

        const paid = money.spend(item.currency, item.price);

        if (!paid) return "no_money";

        const added = inventory.addItem(item.id, item.amount);

        if (!added) {
            money.add(item.currency, item.price);
            return "inventory_full";
        }

        return "success";
    }

    sell(itemId: number): SellResult {
        const item = this.currentShop?.items.find((i) => i.id === itemId);

        if (!item) return "no_item";

        const inventory = InventorySystem.getInstance();
        const money = MoneySystem.getInstance();

        const removed = inventory.removeItemById(item.id, item.amount);

        if (!removed) return "no_item";

        money.add(item.currency, item.price);

        return "success";
    }

    sellAll(itemId: number): SellResult {
        const item = this.currentShop?.items.find((i) => i.id === itemId);

        if (!item) return "no_item";

        const inventory = InventorySystem.getInstance();
        const money = MoneySystem.getInstance();

        const quantity = inventory.getItemQuantity(item.id);

        if (quantity <= 0) return "no_item";

        const removed = inventory.removeItemById(item.id, quantity);

        if (!removed) return "no_item";

        money.add(item.currency, item.price * quantity);

        return "success";
    }
}
