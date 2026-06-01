import { ITEMS } from "../data/ItemDatabase";

export function renderItemIcon(element: HTMLElement, itemId: number) {
    const itemData = ITEMS[itemId];
    if (!itemData) return;

    let img = element.querySelector("img") as HTMLImageElement;

    if (itemData.icon) {
        element.querySelector(".sprite-icon")?.remove();

        // imagem própria
        if (!img) {
            img = document.createElement("img");
            element.prepend(img);
        }
        img.setAttribute("src", itemData.icon);
        img.setAttribute("alt", itemData.name);
    } else if (
        itemData.spritesheet !== undefined &&
        itemData.col !== undefined &&
        itemData.row !== undefined
    ) {
        // spritesheet
        img?.remove(); // remove img se existir

        let sprite = element.querySelector(".sprite-icon") as HTMLElement;

        if (!sprite) {
            sprite = document.createElement("div");
            sprite.className = "sprite-icon";
            element.prepend(sprite);
        }

        sprite.style.backgroundImage = `url('${itemData.spritesheet}')`;
        sprite.style.backgroundPosition = `-${itemData.col * 32}px -${itemData.row * 32}px`;
        sprite.title = itemData.name;
    }
}
