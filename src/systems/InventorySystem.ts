import type { InventorySlot } from "../types/InventoryTypes";
import { ITEMS } from "../data/ItemDatabase";

type Listener = () => void;

export class InventorySystem {
    private static instance: InventorySystem;

    static getInstance(): InventorySystem {
        if (!this.instance) {
            this.instance = new InventorySystem();
        }
        return this.instance;
    }

    slots: InventorySlot[] = Array(28).fill(null);
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

    // VASCO quando coletares a fruta das addItem aqui
    addItem(id: number, quantity: number = 1): boolean {
        const itemData = ITEMS[id];
        if (!itemData) return false;

        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];

            if (slot && slot.id === id) {
                const max = itemData.maxStack;

                if (slot.quantity >= max) continue;

                const space = max - slot.quantity;
                const addAmount = Math.min(space, quantity);

                slot.quantity += addAmount;
                quantity -= addAmount;

                if (quantity <= 0) {
                    this.emitInventoryChange();
                    return true;
                }
            }
        }

        for (let i = 0; i < this.slots.length; i++) {
            if (quantity <= 0) break;

            if (this.slots[i] === null) {
                const slotCount = this.slots.filter((s) => s?.id === id).length;

                if (
                    itemData.maxSlots !== undefined &&
                    slotCount >= itemData.maxSlots
                ) {
                    break;
                }

                const addAmount = Math.min(itemData.maxStack, quantity);

                this.slots[i] = {
                    id,
                    quantity: addAmount,
                };

                quantity -= addAmount;
            }
        }

        this.emitInventoryChange();
        return quantity <= 0;
    }

    getItemQuantity(id: number): number {
        return this.slots
            .filter((slot) => slot?.id === id)
            .reduce((total, slot) => total + slot!.quantity, 0);
    }

    removeItem(index: number) {
        const slot = this.slots[index];
        if (!slot) return;

        this.slots[index] = null;

        this.emitInventoryChange();
    }

    removeItemById(id: number, quantity: number = 1): boolean {
        const total = this.slots
            .filter((slot) => slot?.id === id)
            .reduce((sum, slot) => sum + slot!.quantity, 0);

        if (total < quantity) return false;

        let remaining = quantity;

        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            if (!slot || slot.id !== id) continue;

            const removeAmount = Math.min(slot.quantity, remaining);
            slot.quantity -= removeAmount;
            remaining -= removeAmount;

            if (slot.quantity <= 0) {
                this.slots[i] = null;
            }

            if (remaining <= 0) {
                this.emitInventoryChange();
                return true;
            }
        }

        return false;
    }

    swapItems(a: number, b: number) {
        const temp = this.slots[a];
        this.slots[a] = this.slots[b];
        this.slots[b] = temp;

        this.emitInventoryChange();
    }

    // VASCO VE AQUI, opara verifcar qual é o item que tens na mao
    getCurrentItem() {
        const slot = this.slots[this.selectedSlot];
        if (!slot) return null;

        return ITEMS[slot.id];
    }

    convertOneCurrentItem(newItemId: number): boolean {
        const slot = this.slots[this.selectedSlot];
        if (!slot) return false;

        const oldItemId = slot.id;

        slot.quantity--;

        if (slot.quantity <= 0) {
            this.slots[this.selectedSlot] = null;
        }

        const added = this.addItem(newItemId, 1);

        if (!added) {
            this.addItem(oldItemId, 1);
            return false;
        }

        this.emitInventoryChange();
        return true;
    }

    canReceiveSlotAt(index: number, incomingSlot: InventorySlot): boolean {
        if (!incomingSlot) return true;

        const itemData = ITEMS[incomingSlot.id];
        if (!itemData) return false;

        if (incomingSlot.quantity > itemData.maxStack) return false;

        if (itemData.maxSlots === undefined) return true;

        const currentSlot = this.slots[index];

        const currentCount = this.slots.filter((slot) => {
            return slot?.id === incomingSlot.id;
        }).length;

        const targetAlreadyHasSameItem = currentSlot?.id === incomingSlot.id;

        if (targetAlreadyHasSameItem) return true;

        return currentCount < itemData.maxSlots;
    }

    addStartingItems() {
        if (this.getItemQuantity(1) > 0) return;

        this.addItem(1, 1);   // Enxada
        this.addItem(2, 1);   // Foice
        this.addItem(3, 1);   // Balde Vazio
        this.addItem(4, 5);   // Balde com Água
        this.addItem(10, 5);  // Sementes de Uvas (para teste)
    }

    toggleInventory() {
        this.isInventoryOpen = !this.isInventoryOpen;
        this.emitInventoryChange();
    }

    closeInventory() {
        this.isInventoryOpen = false;
        this.emitInventoryChange();
    }

    forceRefresh() {
        this.emitInventoryChange();
    }

    getSaveData() {
        return {
            slots: this.slots,
            selectedSlot: this.selectedSlot,
        };
    }

    loadSaveData(data: { slots: InventorySlot[]; selectedSlot: number }) {
        this.slots = data.slots;
        this.selectedSlot = data.selectedSlot;

        this.emitInventoryChange();
        this.emitSelectionChange();
    }
}
