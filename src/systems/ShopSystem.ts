import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";
import { type Shop, type ShopType } from "../types/ShopTypes";
import { FERRAGENS_SHOP } from "../data/shops/ferragensShop";
import { SEMENTES_SHOP } from "../data/shops/sementesShop";
import { MERCADO_SHOP } from "../data/shops/mercadoShop";

type BuyResult = "success" | "no_money" | "inventory_full" | "max_slots";
type SellResult = "success" | "no_item";

export class ShopSystem {
    private static instance: ShopSystem;

    static getInstance() {
        if (!this.instance) this.instance = new ShopSystem();
        return this.instance;
    }

    private shops: Record<ShopType, Shop> = {
        ferragens: FERRAGENS_SHOP,
        sementes: SEMENTES_SHOP,
        mercado: MERCADO_SHOP,
    };

    private currentShop: Shop | null = null;

    open(type: ShopType) {
        console.log("Loja aberta: ", type);
        this.currentShop = this.shops[type];
        return this.currentShop;
    }

    close() {
        this.currentShop = null;
    }

    getCurrentShop() {
        return this.currentShop;
    }

    // TODO: melhorar a funçao, devido ao reembolso desnecessário
    buy(itemId: number): BuyResult {
        if (!this.currentShop) return "inventory_full";

        const item = this.currentShop.items.find((i) => i.id === itemId);
        if (!item) return "inventory_full";

        const money = MoneySystem.getInstance();
        const inv = InventorySystem.getInstance();

        const spent = money.spend(item.currency, item.price);
        if (!spent) return "no_money";

        const added = inv.addItem(item.id, item.amount);
        if (!added) {
            money.add(item.currency, item.price);
            return "inventory_full";
        }

        return "success";
    }

    sell(itemId: number): SellResult {
        if (!this.currentShop) return "no_item";

        const item = this.currentShop.items.find((i) => i.id === itemId);
        if (!item) return "no_item";

        const inv = InventorySystem.getInstance();
        const money = MoneySystem.getInstance();

        const removed = inv.removeItemById(item.id, item.amount);
        if (!removed) return "no_item";

        money.add(item.currency, item.price);
        return "success";
    }
}
