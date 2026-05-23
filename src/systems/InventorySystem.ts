export interface Item {
    id: string;
    name: string;
    icon: string;
    quantity: number;
    // maxStack: number;  ← TIRA ISSO!
}

export class InventorySystem {
    private static _instance: InventorySystem;

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
            { id: "hoe", name: "Enxada", icon: "enxada", quantity: 1 },
            {
                id: "empty_bucket",
                name: "Balde Vazio",
                icon: "balde_vazio",
                quantity: 1,
            },
            { id: "scythe", name: "Foice", icon: "foice", quantity: 1 },
        ];

        for (const tool of startingTools) {
            this.addItem(tool);
        }
    }

    addItem(item: Item): boolean {
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i]?.id === item.id) {
                this.slots[i]!.quantity += item.quantity;
                return true;
            }
        }

        const emptyIndex = this.slots.findIndex((slot) => slot === null);
        if (emptyIndex === -1) return false;

        this.slots[emptyIndex] = item;
        return true;
    }

    removeItem(slotIndex: number): void {
        const slot = this.slots[slotIndex];
        if (!slot) return;

        slot.quantity--;
        if (slot.quantity === 0) {
            this.slots[slotIndex] = null;
        }
    }

    selectSlot(index: number): void {
        if (index >= 0 && index < 8) {
            this.selectedSlot = index;
        }
    }
}
