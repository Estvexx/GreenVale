import { StorageSystem } from "../systems/StorageSystem";
import { InventorySystem } from "../systems/InventorySystem";

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
        document.getElementById("storage-overlay")?.classList.remove("hidden");
    }

    close() {
        document.getElementById("storage-overlay")?.classList.add("hidden");
    }

    private bindSlots() {
        // bind only the inventory slots that live inside the storage overlay
        document
            .querySelectorAll("#storage-overlay #inventory-overlay .slot")
            .forEach((slot) => {
                slot.addEventListener("click", () => {
                    const index = Number(slot.getAttribute("data-slot"));

                    this.handleClick("inventory", index);
                });
            });

        // bind only the storage grid slots
        document
            .querySelectorAll("#storage-overlay #storage-grid .slot")
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

    private swapBetween(a: any[], aIndex: number, b: any[], bIndex: number) {
        const temp = a[aIndex];
        a[aIndex] = b[bIndex];
        b[bIndex] = temp;
    }

    private updateSelectionUI() {
        // Only toggle selection for slots inside the storage overlay
        document.querySelectorAll("#storage-overlay .slot").forEach((slot) => {
            const index = Number(slot.getAttribute("data-slot"));

            const inInventorySection = !!slot.closest("#inventory-overlay");
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
            .querySelectorAll("#storage-overlay #inventory-overlay .slot")
            .forEach((slot) => {
                const index = Number(slot.getAttribute("data-slot"));

                const item = this.inventory.slots[index];

                slot.innerHTML = "";

                if (!item) return;

                const img = document.createElement("img");
                img.src = `assets/items/${item.id}.png`;

                slot.appendChild(img);

                if (item.quantity > 1) {
                    const qty = document.createElement("span");
                    qty.textContent = String(item.quantity);
                    slot.appendChild(qty);
                }
            });
    }

    private renderStorage() {
        // render only the storage grid slots
        document
            .querySelectorAll("#storage-overlay #storage-grid .slot")
            .forEach((slot) => {
                const index = Number(slot.getAttribute("data-slot"));

                const item = this.storage.slots[index];

                slot.innerHTML = "";

                if (!item) return;

                const img = document.createElement("img");
                img.src = `assets/items/${item.id}.png`;

                slot.appendChild(img);

                if (item.quantity > 1) {
                    const qty = document.createElement("span");
                    qty.textContent = String(item.quantity);
                    slot.appendChild(qty);
                }
            });
    }
}
