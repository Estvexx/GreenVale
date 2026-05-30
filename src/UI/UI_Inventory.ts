import { InventorySystem } from "../systems/InventorySystem";

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

                    img.setAttribute("src", item.icon);
                    img.setAttribute("alt", item.name);
                } else {
                    img?.remove();
                }
            });
    }
}
