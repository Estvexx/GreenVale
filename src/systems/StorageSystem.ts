import type { InventorySlot } from "../types/InventoryTypes";
import { ITEMS } from "../data/ItemDatabase";

type Listener = () => void;

export class StorageSystem {
    private static instance: StorageSystem;

    static getInstance(): StorageSystem {
        if (!this.instance) {
            this.instance = new StorageSystem();
        }
        return this.instance;
    }

    slots: InventorySlot[] = Array(40).fill(null);

    private listeners: Listener[] = [];

    onChange(cb: Listener) {
        this.listeners.push(cb);
    }

    private emitChange() {
        this.listeners.forEach((cb) => cb());
    }

    addItem(id: number, quantity: number = 1): boolean {
        const itemData = ITEMS[id];
        if (!itemData) return false;

        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];

            if (slot && slot.id === id) {
                const space = itemData.maxStack - slot.quantity;

                if (space > 0) {
                    const add = Math.min(space, quantity);

                    slot.quantity += add;
                    quantity -= add;
                }

                if (quantity <= 0) {
                    this.emitChange();
                    return true;
                }
            }
        }

        for (let i = 0; i < this.slots.length; i++) {
            if (quantity <= 0) break;

            if (!this.slots[i]) {
                const add = Math.min(itemData.maxStack, quantity);

                this.slots[i] = {
                    id,
                    quantity: add,
                };

                quantity -= add;
            }
        }

        this.emitChange();
        return quantity <= 0;
    }

    swap(a: number, b: number) {
        const temp = this.slots[a];
        this.slots[a] = this.slots[b];
        this.slots[b] = temp;

        this.emitChange();
    }

    forceRefresh() {
        this.emitChange();
    }

    getSaveData() {
        return {
            slots: this.slots,
        };
    }

    loadSaveData(data: { slots: InventorySlot[] }) {
        this.slots = data.slots;

        this.emitChange();
    }
}
