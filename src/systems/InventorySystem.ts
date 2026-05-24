import { SHOP_DATA, type ShopType } from "../shops/ShopData";

export interface Item {
    id: string;
    name: string;
    icon: string;
    quantity: number;
    maxStack: number;
}

export class InventorySystem {
    private static _instance: InventorySystem;

    private onChangeCallback: (() => void) | null = null;

    onChange(callback: () => void): void {
        this.onChangeCallback = callback;
    }

    // Assim so utilizo uma instancia e chamo o getinstance na farmscne
    static getInstance(): InventorySystem {
        if (!InventorySystem._instance) {
            InventorySystem._instance = new InventorySystem();
        }
        return InventorySystem._instance;
    }
    slots: (Item | null)[] = [null, null, null, null, null, null, null, null];
    selectedSlot: number = 0;

    addStartingItems() {
        const startingTools: Item[] = [
            {
                id: "hoe",
                name: "Enxada",
                icon: "enxada",
                quantity: 1,
                maxStack: 1,
            },
            //{id: "empty_bucket",name: "Balde Vazio",icon: "balde_vazio",quantity: 1, maxStack: 99},
            //{ id: "scythe", name: "Foice", icon: "foice", quantity: 1,  maxStack: 1},
        ];

        for (const tool of startingTools) {
            this.addItem(tool);
        }
    }

    addItem(item: Item): boolean {
        console.log(
            `DEBUG BRABO ${item.quantity}x ${item.name} ao inventário...`,
        );
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i]?.id === item.id) {
                this.slots[i]!.quantity += item.quantity;
                return true;
            }
        }

        const emptyIndex = this.slots.findIndex((slot) => slot === null);
        if (emptyIndex === -1) return false;

        this.slots[emptyIndex] = item;
        this.onChangeCallback?.();
        this.syncShopState();
        return true;
    }

    removeItem(slotIndex: number): void {
        const slot = this.slots[slotIndex];
        if (!slot) return;

        slot.quantity--;
        if (slot.quantity === 0) {
            this.slots[slotIndex] = null;
        }
        this.onChangeCallback?.();
        this.syncShopState();
    }

    selectSlot(index: number): void {
        if (index >= 0 && index < 8) {
            this.selectedSlot = index;
        }
    }

    private syncShopState(): void {
        for (const shopType in SHOP_DATA) {
            SHOP_DATA[shopType as ShopType].forEach((shopItem) => {
                const existing = this.slots.find((s) => s?.id === shopItem.id);
                const quantity = existing?.quantity ?? 0;
                shopItem.isActive = quantity < shopItem.maxStack;
            });
        }

        for (const shopType in SHOP_DATA) {
            const grid = document.getElementById(`grid-${shopType}`);
            if (grid && grid.innerHTML !== "") {
                (window as any).openShop(shopType);
            }
        }
    }
}
