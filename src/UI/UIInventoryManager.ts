import { InventorySystem } from "../systems/InventorySystem";

export class UIInventoryManager {
    private inventory = InventorySystem.getInstance();

    constructor() {
        document
            .getElementById("btnInventario")
            ?.addEventListener("click", () => this.toggle());

        document.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    toggle() {
        if (this.inventory.isInventoryOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.inventory.isInventoryOpen = true;

        document
            .getElementById("inventory-overlay")
            ?.classList.remove("hidden");

        document.getElementById("hotbar-hud")?.classList.add("hidden");
    }

    close() {
        this.inventory.isInventoryOpen = false;

        document.getElementById("inventory-overlay")?.classList.add("hidden");

        document.getElementById("hotbar-hud")?.classList.remove("hidden");
    }
}
