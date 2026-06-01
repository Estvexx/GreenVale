import { InventorySystem } from "../systems/InventorySystem";
import { renderItemIcon } from "../utils/renderItemIcon";

export class UI_Inventory {
    private inventory = InventorySystem.getInstance();

    constructor() {
        this.inventory.onInventoryChange(() => {
            this.render();
        });

        this.render();
    }

    render() {
        document
            .querySelectorAll("#inventory-overlay .slot")
            .forEach((slot) => {
                const index = Number(slot.getAttribute("data-slot"));
                const item = this.inventory.slots[index];

                if (item) {
                    renderItemIcon(slot as HTMLElement, item.id);
                } else {
                    slot.querySelector("img")?.remove();
                    slot.querySelector(".sprite-icon")?.remove();
                }
            });
    }
}
