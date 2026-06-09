import { InventorySystem } from "../systems/InventorySystem";
import { ToolSkinSystem } from "../systems/ToolSkinSystem";
import { renderItemIcon } from "../utils/renderItemIcon";

export class UI_Inventory {
    private inventory = InventorySystem.getInstance();

    constructor() {
        this.inventory.onInventoryChange(() => {
            this.render();
        });

        ToolSkinSystem.getInstance().onChange(() => {
            this.render();
        });

        this.render();
    }

    render() {
        document
            .querySelectorAll<HTMLElement>("#inventory-overlay .slot")
            .forEach((slot) => {
                const index = Number(slot.dataset.slot);
                const item = this.inventory.slots[index];

                this.clearSlot(slot);

                if (!item) return;

                renderItemIcon(slot, item.id);

                if (item.quantity > 1) {
                    const qty = document.createElement("span");
                    qty.className = "qty";
                    qty.textContent = String(item.quantity);
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
