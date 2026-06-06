import { ITEMS } from "../data/ItemDatabase";
import { InventorySystem } from "../systems/InventorySystem";

export class UI_SeedPicker {
    private overlay = document.getElementById("seed-picker")!;
    private list = document.getElementById("seed-picker-list")!;
    private closeBtn = document.getElementById("seed-picker-close")!;
    private inventory = InventorySystem.getInstance();

    constructor() {
        this.closeBtn.addEventListener("click", () => this.close());
    }

    open(onPick: (seedId: number) => void) {
        const seeds = this.getAvailableSeeds();

        if (seeds.length === 0) {
            return false;
        }

        this.list.innerHTML = "";

        seeds.forEach(({ id, quantity }) => {
            const item = ITEMS[id];
            const row = document.createElement("div");
            row.className = "seed-picker-item";

            const img = document.createElement("img");
            img.src = `assets/images/crops/${item.cropKey}/stage_0.png`;
            img.alt = item.name;

            const name = document.createElement("span");
            name.textContent = item.name;

            const qty = document.createElement("span");
            qty.className = "qty";
            qty.textContent = `x${quantity}`;

            row.appendChild(img);
            row.appendChild(name);
            row.appendChild(qty);

            row.addEventListener("click", () => {
                this.close();
                onPick(id);
            });

            this.list.appendChild(row);
        });

        this.overlay.classList.remove("hidden");
        return true;
    }

    close() {
        this.overlay.classList.add("hidden");
        this.list.innerHTML = "";
    }

    private getAvailableSeeds() {
        const result: { id: number; quantity: number }[] = [];

        this.inventory.slots.forEach((slot) => {
            if (!slot) return;
            const item = ITEMS[slot.id];
            if (item?.isSeed) {
                result.push({ id: slot.id, quantity: slot.quantity });
            }
        });

        return result;
    }
}
