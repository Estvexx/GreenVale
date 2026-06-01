import { InventorySystem } from "../systems/InventorySystem";
import { ITEMS } from "../data/ItemDatabase";

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

            let img = slot.querySelector("img");

            if (inventorySlot) {
                const itemData = ITEMS[inventorySlot.id];

                if (!itemData) return;

                if (!img) {
                    img = document.createElement("img");
                    slot.prepend(img);
                }

                img.setAttribute("src", itemData.icon);
                img.setAttribute("alt", itemData.name);
            } else {
                img?.remove();
            }
        });
    }
}
