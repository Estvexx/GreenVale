export interface Item {
    id: string;
    name: string;
    description: string;
    icon: string;
    quantity: number;
    maxStack: number;
}

type Listener = () => void;

export class InventorySystem {
    private static instance: InventorySystem;

    static getInstance(): InventorySystem {
        if (!this.instance) {
            this.instance = new InventorySystem();
        }
        return this.instance;
    }

    slots: (Item | null)[] = Array(28).fill(null);
    selectedSlot = 0;
    isInventoryOpen = false;

    private inventoryListeners: Listener[] = [];
    private selectionListeners: Listener[] = [];

    onInventoryChange(cb: Listener) {
        this.inventoryListeners.push(cb);
    }

    onSelectionChange(cb: Listener) {
        this.selectionListeners.push(cb);
    }

    private emitInventoryChange() {
        this.inventoryListeners.forEach((cb) => cb());
    }

    private emitSelectionChange() {
        this.selectionListeners.forEach((cb) => cb());
    }

    selectSlot(index: number) {
        if (index < 0 || index >= this.slots.length) return;

        this.selectedSlot = index;
        this.emitSelectionChange();
    }

    addStartingItems() {
        const startingTools: Item[] = [
            {
                id: "hoe",
                name: "Enxada",
                icon: "assets/images/tools/Enxada.png",
                description: "Use para preparar a terra para plantar.",
                quantity: 1,
                maxStack: 1,
            },
        ];

        for (const tool of startingTools) {
            this.addItem(tool);
        }
    }

    addItem(item: Item): boolean {
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];

            if (slot && slot.id === item.id && slot.quantity < slot.maxStack) {
                slot.quantity += item.quantity;
                this.emitInventoryChange();
                return true;
            }
        }

        const empty = this.slots.findIndex((s) => s === null);

        if (empty === -1) return false;

        this.slots[empty] = { ...item };
        this.emitInventoryChange();
        return true;
    }

    getCurrentItem(): Item | null {
        return this.slots[this.selectedSlot];
    }

    removeItem(index: number) {
        const slot = this.slots[index];
        if (!slot) return;

        slot.quantity--;

        if (slot.quantity <= 0) {
            this.slots[index] = null;
        }

        this.emitInventoryChange();
    }

    swapItems(from: number, to: number) {
        const temp = this.slots[from];
        this.slots[from] = this.slots[to];
        this.slots[to] = temp;

        this.emitInventoryChange();
    }

    openInventory() {
        if (!this.isInventoryOpen) {
            this.isInventoryOpen = true;
            this.emitInventoryChange();
        }
    }

    closeInventory() {
        if (this.isInventoryOpen) {
            this.isInventoryOpen = false;
            this.emitInventoryChange();
        }
    }

    toggleInventory() {
        console.log(
            "Toggling inventory. Currently open?",
            this.isInventoryOpen,
        );
        this.isInventoryOpen ? this.closeInventory() : this.openInventory();
    }
}
