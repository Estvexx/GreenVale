import { ITEMS } from "../data/ItemDatabase";

export function renderItemIcon(element: HTMLElement, itemId: number) {
    const itemData = ITEMS[itemId];
    if (!itemData) return;

    let img = element.querySelector("img") as HTMLImageElement;

    if (itemData.icon) {
        // imagem própria
        if (!img) {
            img = document.createElement("img");
            element.prepend(img);
        }
        img.setAttribute("src", itemData.icon);
        img.setAttribute("alt", itemData.name);
    } else if (
        itemData.spritesheet !== undefined &&
        itemData.frame !== undefined
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
        sprite.style.backgroundPosition = `-${itemData.frame * 32}px 0px`;
        sprite.title = itemData.name;
    }
}
