import { SoundManager } from "../sounds/SoundsManager";
import { InventorySystem } from "../systems/InventorySystem";
import { renderItemIcon } from "../utils/renderItemIcon";

export class UI_HotBar {
    private inventory = InventorySystem.getInstance();

    private slots: NodeListOf<HTMLElement>;

    constructor() {
        this.slots = document.querySelectorAll("#hotbar-container .slot");

        this.inventory.onSelectionChange(() => {
            this.updateSelection();
        });

        this.inventory.onInventoryChange(() => {
            this.render();
        });

        this.bindSlotClicks();

        this.updateSelection();
        this.render();
    }

    private bindSlotClicks() {
        this.slots.forEach((slot) => {
            slot.addEventListener("click", () => {
                SoundManager.play("click_sound");
                const index = Number(slot.dataset.slot);

                this.inventory.selectSlot(index);
            });
        });
    }

    private updateSelection() {
        this.slots.forEach((slot) => {
            const index = Number(slot.dataset.slot);

            slot.classList.toggle(
                "active",
                index === this.inventory.selectedSlot,
            );
        });
    }

    private render() {
        this.slots.forEach((slot) => {
            const index = Number(slot.dataset.slot);
            const inventorySlot = this.inventory.slots[index];

            this.clearSlot(slot);

            if (!inventorySlot) return;

            renderItemIcon(slot, inventorySlot.id);

            if (inventorySlot.quantity > 1) {
                const qty = document.createElement("span");

                qty.className = "qty";
                qty.textContent = String(inventorySlot.quantity);

                slot.appendChild(qty);
            }
        });
    }

    private clearSlot(slot: HTMLElement) {
        slot.querySelector("img")?.remove();
        slot.querySelector(".sprite-icon")?.remove();
        slot.querySelector(".qty")?.remove();
    }
}
