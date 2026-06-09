import { ITEMS } from "../data/ItemDatabase";
import { InventorySystem } from "../systems/InventorySystem";
import { t, applyTranslations } from "../i18n";

export class UI_SeedPicker {
    private overlay  = document.getElementById("seed-picker")!;
    private list     = document.getElementById("seed-picker-list")!;
    private closeBtn = document.getElementById("seed-picker-close")!;
    private inventory = InventorySystem.getInstance();

    constructor() {
        this.closeBtn.addEventListener("click", () => this.close());
    }

    open(onPick: (seedId: number) => void): boolean {
        const seeds = this.availableSeeds();
        if (seeds.length === 0) return false;

        this.list.innerHTML = "";
        seeds.forEach(({ id, quantity }) => this.addRow(id, quantity, onPick));
        this.overlay.classList.remove("hidden");
        applyTranslations();
        return true;
    }

    close() {
        this.overlay.classList.add("hidden");
        this.list.innerHTML = "";
    }

    private addRow(id: number, quantity: number, onPick: (id: number) => void) {
        const item = ITEMS[id];
        const row  = document.createElement("div");
        row.className = "seed-picker-item";

        const img  = document.createElement("img");
        img.src    = `assets/images/crops/${item.cropKey}/stage_0.png`;
        img.alt    = item.name;

        const label = document.createElement("span");
        label.textContent = item.nameKey ? t(item.nameKey) : item.name;

        const qty = document.createElement("span");
        qty.className   = "qty";
        qty.textContent = `x${quantity}`;

        row.append(img, label, qty);
        row.addEventListener("click", () => { this.close(); onPick(id); });
        this.list.appendChild(row);
    }

    private availableSeeds() {
        return this.inventory.slots
            .filter(slot => slot && ITEMS[slot.id]?.isSeed)
            .map(slot => ({ id: slot!.id, quantity: slot!.quantity }));
    }
}
