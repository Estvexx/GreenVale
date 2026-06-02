import { StorageSystem } from "../systems/StorageSystem";
import { InventorySystem } from "../systems/InventorySystem";
import type { InventorySlot } from "../types/InventoryTypes";
import { renderItemIcon } from "../utils/renderItemIcon";

type Selected = {
    container: "inventory" | "storage";
    index: number;
} | null;

export class UI_StorageManager {
    private storage = StorageSystem.getInstance();
    private inventory = InventorySystem.getInstance();

    private selected: Selected = null;

    constructor() {
        this.storage.onChange(() => this.render());
        this.inventory.onInventoryChange(() => this.render());

        document
            .getElementById("storage-close")
            ?.addEventListener("click", () => this.close());

        this.bindSlots();

        this.render();
    }

    open() {
        this.selected = null;
        document.getElementById("storage-overlay")?.classList.remove("hidden");
        this.updateSelectionUI();
        this.render();
    }

    close() {
        this.selected = null;
        document.getElementById("storage-overlay")?.classList.add("hidden");
        this.updateSelectionUI();
    }

    private bindSlots() {
        // bind only the inventory slots that live inside the storage overlay
        document
            .querySelectorAll<HTMLDivElement>("#storage-overlay #inventory-grid .slot")
            .forEach((slot) => {
                slot.addEventListener("click", () => {
                    const index = Number(slot.getAttribute("data-slot"));

                    this.handleClick("inventory", index);
                });
            });

        // bind only the storage grid slots
        document
            .querySelectorAll<HTMLDivElement>("#storage-overlay #storage-grid .slot")
            .forEach((slot) => {
                slot.addEventListener("click", () => {
                    const index = Number(slot.getAttribute("data-slot"));

                    this.handleClick("storage", index);
                });
            });
    }

    private handleClick(container: "inventory" | "storage", index: number) {
        if (!this.selected) {
            this.selected = { container, index };
            this.updateSelectionUI();
            return;
        }

        const from = this.selected;

        if (from.container === container) {
            if (container === "inventory") {
                this.inventory.swapItems(from.index, index);
            } else {
                this.storage.swap(from.index, index);
            }

            this.selected = null;
            this.updateSelectionUI();
            return;
        }

        // INVENTORY -> STORAGE
        if (from.container === "inventory") {
            this.swapBetween(
                this.inventory.slots,
                from.index,
                this.storage.slots,
                index,
            );
        }

        // STORAGE para INVENTORY
        else {
            this.swapBetween(
                this.storage.slots,
                from.index,
                this.inventory.slots,
                index,
            );
        }

        this.inventory.forceRefresh();
        this.storage.forceRefresh();

        this.selected = null;
        this.updateSelectionUI();
    }

    private swapBetween(
        a: InventorySlot[],
        aIndex: number,
        b: InventorySlot[],
        bIndex: number,
    ) {
        const temp = a[aIndex];
        a[aIndex] = b[bIndex];
        b[bIndex] = temp;
    }

    private updateSelectionUI() {
        // Only toggle selection for slots inside the storage overlay
        document.querySelectorAll("#storage-overlay .slot").forEach((slot) => {
            const index = Number(slot.getAttribute("data-slot"));

            const inInventorySection = !!slot.closest("#inventory-grid");
            const inStorageSection = !!slot.closest("#storage-grid");

            let isSelected = false;

            if (this.selected) {
                if (
                    this.selected.container === "inventory" &&
                    inInventorySection &&
                    this.selected.index === index
                )
                    isSelected = true;

                if (
                    this.selected.container === "storage" &&
                    inStorageSection &&
                    this.selected.index === index
                )
                    isSelected = true;
            }

            slot.classList.toggle("selected", isSelected);
        });
    }

    private render() {
        this.renderInventory();
        this.renderStorage();
    }

    private renderInventory() {
        // render only the inventory section inside the storage overlay
        document
            .querySelectorAll<HTMLElement>("#storage-overlay #inventory-grid .slot")
            .forEach((slot) => {
                const index = Number(slot.getAttribute("data-slot"));
                this.renderSlot(slot, this.inventory.slots[index]);
            });
    }

    private renderStorage() {
        // render only the storage grid slots
        document
            .querySelectorAll<HTMLElement>("#storage-overlay #storage-grid .slot")
            .forEach((slot) => {
                const index = Number(slot.getAttribute("data-slot"));
                this.renderSlot(slot, this.storage.slots[index]);
            });
    }

    private renderSlot(slot: HTMLElement, item: InventorySlot) {
        slot.innerHTML = "";

        if (!item) return;

        renderItemIcon(slot, item.id);

        if (item.quantity > 1) {
            const qty = document.createElement("span");
            qty.className = "qty";
            qty.textContent = String(item.quantity);
            slot.appendChild(qty);
        }
    }
}
