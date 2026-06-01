import { InventorySystem } from "../systems/InventorySystem";
import { renderItemIcon } from "../utils/renderItemIcon";

export class UI_HotBar {
    private inventory: InventorySystem;

    constructor() {
        this.inventory = InventorySystem.getInstance();

        // listeners
        this.inventory.onSelectionChange(() => {
            this.updateHotbarSelection();
        });

        this.inventory.onInventoryChange(() => {
            this.updateHotbarItems();
        });

        // render inicial
        this.updateHotbarSelection();
        this.updateHotbarItems();

        // clicks HTML
        this.bindSlotClicks();
    }

    private bindSlotClicks() {
        document.querySelectorAll(".slot").forEach((slot, index) => {
            slot.addEventListener("click", () => {
                this.inventory.selectSlot(index); // Aqui eu posso chamar a funçao debaixo
            });
        });
    }

    private updateHotbarSelection() {
        document.querySelectorAll(".slot").forEach((slot, index) => {
            slot.classList.toggle(
                "active",
                index === this.inventory.selectedSlot,
            );
        });
    }

    private updateHotbarItems() {
        document.querySelectorAll(".slot").forEach((slot) => {
            const index = Number(slot.getAttribute("data-slot"));
            const inventorySlot = this.inventory.slots[index];
            let qty = slot.querySelector(".qty");

            if (inventorySlot) {
                renderItemIcon(slot as HTMLElement, inventorySlot.id);

                if (!qty) {
                    qty = document.createElement("span");
                    qty.className = "qty";
                    slot.appendChild(qty);
                }

                qty.textContent = String(inventorySlot.quantity);
            } else {
                slot.querySelector("img")?.remove();
                slot.querySelector(".sprite-icon")?.remove();
                qty?.remove();
            }
        });
    }
}
