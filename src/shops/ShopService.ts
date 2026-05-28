import { MoneySystem } from "../systems/MoneySystem";
import { InventorySystem } from "../systems/InventorySystem";
import { SHOP_DATA, type ShopType } from "./ShopData";

export class ShopService {
    private money = MoneySystem.getInstance();
    private inventory = InventorySystem.getInstance();

    buy(itemId: string, shopType: ShopType): boolean {
        const item = SHOP_DATA[shopType].find((i) => i.id === itemId);
        if (!item) return false;

        const success = this.money.spendMoney(item.price);
        if (!success) return false;

        console.log(`Item bought: ${item.name}`);
        this.inventory.addItem({
            id: item.id,
            name: item.name,
            icon: item.icon,
            quantity: 1,
            maxStack: item.maxStack,
        });

        return true;
    }

    sell(itemId: string, price: number): void {
        this.inventory.removeItem(
            this.inventory.slots.findIndex((s) => s?.id === itemId),
        );
        this.money.addMoney(price);
    }
}
