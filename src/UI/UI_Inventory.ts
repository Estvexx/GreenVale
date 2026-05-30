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
        const slots = document.querySelectorAll("#inventory-overlay .slot");

        this.inventory.slots.forEach((item, index) => {
            const slot = slots[index];
            if (!slot) return;

            let img = slot.querySelector("img");

            if (item) {
                if (!img) {
                    img = document.createElement("img");
                    slot.appendChild(img);
                }

                img.setAttribute("src", item.icon);
                img.setAttribute("alt", item.name);
            } else {
                img?.remove();
            }

            // highlight hotbar selection também aqui (opcional)
            slot.classList.toggle(
                "active",
                index === this.inventory.selectedSlot,
            );
        });
    }
}
