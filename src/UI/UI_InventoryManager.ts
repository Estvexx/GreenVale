import { InventorySystem } from "../systems/InventorySystem";
import { ITEMS } from "../data/ItemDatabase";
import { t } from "../i18n/index";

export class UIInventoryManager {
    private inventory = InventorySystem.getInstance();

    private selectedSlot: number | null = null;

    private overlay = document.getElementById("inventory-overlay");
    private hotbar = document.getElementById("hotbar-container");
    private tooltip = document.getElementById("item-tooltip");

    constructor() {
        document
            .getElementById("btnInventario")
            ?.addEventListener("click", () => {
                this.inventory.toggleInventory();
            });

        document
            .getElementById("close-inventory")
            ?.addEventListener("click", () => {
                this.closeInventory();
            });

        this.inventory.onInventoryChange(() => {
            this.render();
        });

        this.bindSlots();
        this.render();
    }

    private closeInventory() {
        if (!this.inventory.isInventoryOpen) return;

        this.inventory.toggleInventory();
    }

    private bindSlots() {
        const slots = this.getSlots();

        slots.forEach((slot) => {
            slot.addEventListener("click", () => {
                const index = Number(slot.dataset.slot);

                this.onSlotClick(index);
            });

            slot.addEventListener("mouseenter", (e) => {
                const index = Number(slot.dataset.slot);

                this.showTooltip(index, e as MouseEvent);
            });

            slot.addEventListener("mouseleave", () => {
                this.hideTooltip();
            });
        });
    }

    private render() {
        if (this.inventory.isInventoryOpen) {
            this.overlay?.classList.remove("hidden");
            this.hotbar?.classList.add("hidden");
        } else {
            this.overlay?.classList.add("hidden");
            this.hotbar?.classList.remove("hidden");
        }
    }

    private onSlotClick(index: number) {
        if (this.selectedSlot === null) {
            this.selectedSlot = index;
            this.updateSelectionUI();
            return;
        }

        if (this.selectedSlot === index) {
            this.selectedSlot = null;
            this.updateSelectionUI();
            return;
        }

        this.inventory.swapItems(this.selectedSlot, index);

        this.selectedSlot = null;
        this.updateSelectionUI();
    }

    private updateSelectionUI() {
        this.getSlots().forEach((slot) => {
            const index = Number(slot.dataset.slot);

            slot.classList.toggle("selected", index === this.selectedSlot);
        });
    }

    private showTooltip(slotId: number, event: MouseEvent) {
        if (!this.tooltip) return;

        const slot = this.inventory.slots[slotId];
        if (!slot) return;

        const itemData = ITEMS[slot.id];
        if (!itemData) return;

        const title = this.tooltip.querySelector(".tooltip-title");
        const desc = this.tooltip.querySelector(".tooltip-desc");

        if (!title || !desc) return;

        title.textContent = itemData.nameKey
            ? t(itemData.nameKey)
            : itemData.name;

        desc.textContent = itemData.descriptionKey
            ? t(itemData.descriptionKey)
            : (itemData.description ?? "");

        this.tooltip.classList.remove("hidden");

        this.tooltip.style.left = `${event.pageX + 10}px`;
        this.tooltip.style.top = `${event.pageY + 10}px`;
    }

    private hideTooltip() {
        this.tooltip?.classList.add("hidden");
    }

    private getSlots(): NodeListOf<HTMLDivElement> {
        return document.querySelectorAll<HTMLDivElement>(
            "#inventory-overlay .slot",
        );
    }
}
