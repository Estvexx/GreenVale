import { InventorySystem } from "../systems/InventorySystem";
import { ITEMS } from "../data/ItemDatabase";

export class UIInventoryManager {
    private inventory = InventorySystem.getInstance();
    private selectedSlot: number | null = null;
    private tooltip = document.getElementById("item-tooltip");

    constructor() {
        // Aqui trato do clic do  html
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

        this.render();

        const inventoryOverlay = document.getElementById("inventory-overlay");
        const slots = inventoryOverlay
            ? inventoryOverlay.querySelectorAll<HTMLDivElement>(".slot")
            : document.querySelectorAll("#inventory-overlay .slot");

        slots.forEach((slot) => {
            slot.addEventListener("click", () => {
                const index = Number(slot.getAttribute("data-slot"));
                this.onSlotClick(index);
            });

            slot.addEventListener("mouseenter", (e) => {
                const index = Number(slot.getAttribute("data-slot"));

                this.showTooltip(index, e as MouseEvent);
            });

            slot.addEventListener("mouseleave", () => {
                this.hideTooltip();
            });
        });
    }

    private closeInventory() {
        if (this.inventory.isInventoryOpen) {
            this.inventory.toggleInventory();
        }
    }

    private render() {
        console.log(
            "Renderizando UI de Inventário. Inventory aberto?",
            this.inventory.isInventoryOpen,
        );
        const inventoryOverlay = document.getElementById("inventory-overlay");

        const hotbar = document.getElementById("hotbar-container");

        if (this.inventory.isInventoryOpen) {
            console.log("Mostrando inventário, escondendo hotbar");
            inventoryOverlay?.classList.remove("hidden");
            hotbar?.classList.add("hidden");
        } else {
            inventoryOverlay?.classList.add("hidden");
            hotbar?.classList.remove("hidden");
        }
    }

    private onSlotClick(index: number) {
        const inventory = this.inventory;

        // primeiro clique
        if (this.selectedSlot === null) {
            this.selectedSlot = index;
            this.updateSelectionUI();
            return;
        }

        // cancelar seleção
        if (this.selectedSlot === index) {
            this.selectedSlot = null;
            this.updateSelectionUI();
            return;
        }

        // segundo clique → swap
        inventory.swapItems(this.selectedSlot, index);

        // IMPORTANTÍSSIMO: limpar primeiro
        this.selectedSlot = null;

        this.updateSelectionUI();
    }

    private updateSelectionUI() {
        const inventoryOverlay = document.getElementById("inventory-overlay");
        const slots = inventoryOverlay
            ? inventoryOverlay.querySelectorAll<HTMLDivElement>(".slot")
            : document.querySelectorAll("#inventory-overlay .slot");

        slots.forEach((slot) => {
            const index = Number(slot.getAttribute("data-slot"));

            slot.classList.toggle("selected", index === this.selectedSlot);
        });
    }

    private showTooltip(slotId: number, event: MouseEvent) {
        if (!this.tooltip) return;

        const slot = this.inventory.slots[slotId];
        if (!slot) return;

        const itemData = ITEMS[slot.id];
        if (!itemData) return;

        const title = this.tooltip.querySelector(".tooltip-title")!;
        const desc = this.tooltip.querySelector(".tooltip-desc")!;

        title.textContent = itemData.name;
        desc.textContent = itemData.description ?? "";

        this.tooltip.classList.remove("hidden");

        this.tooltip.style.left = event.pageX + 10 + "px";
        this.tooltip.style.top = event.pageY + 10 + "px";
    }

    private hideTooltip() {
        this.tooltip?.classList.add("hidden");
    }
}
