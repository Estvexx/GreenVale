import { InventorySystem } from "../systems/InventorySystem";
import { ITEMS } from "../data/ItemDatabase";

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

                let img = slot.querySelector("img");

                if (item) {
                    if (!img) {
                        img = document.createElement("img");
                        slot.prepend(img);
                    }

                    const itemData = ITEMS[item.id];
                    if (itemData) {
                        img.setAttribute("src", itemData.icon);
                        img.setAttribute("alt", itemData.name);
                    }
                } else {
                    img?.remove();
                }
            });
    }
}
