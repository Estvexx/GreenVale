import { ShopSystem } from "../systems/ShopSystem";
import type { ShopItem } from "../types/ShopTypes";

export class UI_ShopManager {
    private system = ShopSystem.getInstance();

    private overlay = document.getElementById("shop-overlay")!;
    private container = document.getElementById("shop-items")!;
    private closeBtn = document.getElementById("shop-close")!;
    private title = document.getElementById("shop-title")!;

    constructor() {
        this.closeBtn.addEventListener("click", () => this.close());
    }

    open(type: any) {
        const shop = this.system.open(type);

        if (!shop) return;

        this.overlay.classList.remove("hidden");

        // título da loja
        this.title.textContent = shop.name;

        this.render(shop);
    }

    close() {
        this.system.close();
        this.overlay.classList.add("hidden");
        this.container.innerHTML = "";
    }

    private render(shop: any) {
        console.log("Renderizando loja:", shop);
        const shopItems = this.container;

        shopItems.innerHTML = ""; // limpa UI

        shop.items.forEach((item: ShopItem) => {
            console.log("Item:", item);
            const div = document.createElement("div");
            div.className = "shop-item";

            div.innerHTML = `
                <img src="assets/images/tools/${item.icon}.png" alt="${item.name}">
                <div class="shop-item-info">
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-price">${item.price} 💰</div>
                </div>
                <button class="shop-item-btn">Comprar</button>
            `;

            const btn = div.querySelector(".shop-item-btn")!;

            btn.addEventListener("click", () => {
                const success = this.system.buy(item.id);

                if (!success) {
                    btn.textContent = "Sem dinheiro";
                    btn.classList.add("disabled");

                    setTimeout(() => {
                        btn.textContent = "Comprar";
                        btn.classList.remove("disabled");
                    }, 800);

                    return;
                }

                btn.textContent = "Comprado ✓";

                setTimeout(() => {
                    btn.textContent = "Comprar";
                }, 800);
            });

            shopItems.appendChild(div);
        });
    }
}
