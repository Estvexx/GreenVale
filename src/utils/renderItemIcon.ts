import { ITEMS } from "../data/ItemDatabase";
import { ToolSkinSystem } from "../systems/ToolSkinSystem";

export function renderItemIcon(element: HTMLElement, itemId: number) {
    const itemData = ITEMS[itemId];
    if (!itemData) return;

    const skin = ToolSkinSystem.getInstance().getSkinForItem(itemId);
    const icon = skin?.icons?.[itemId] ?? skin?.icon ?? itemData.icon;

    let img = element.querySelector("img") as HTMLImageElement;

    if (icon) {
        element.querySelector(".sprite-icon")?.remove();

        if (!img) {
            img = document.createElement("img");
            element.prepend(img);
        }

        img.setAttribute("src", icon);
        img.setAttribute("alt", itemData.name);
        return;
    }

    if (
        itemData.spritesheet !== undefined &&
        itemData.col !== undefined &&
        itemData.row !== undefined
    ) {
        img?.remove();

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
