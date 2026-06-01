import { ITEMS } from "../data/ItemDatabase";

export function preloadUIImages() {
    Object.values(ITEMS).forEach((item) => {
        if (item.icon) {
            const img = new Image();
            img.src = item.icon;
        }

        if (item.spritesheet) {
            const img = new Image();
            img.src = item.spritesheet;
        }
    });
}
