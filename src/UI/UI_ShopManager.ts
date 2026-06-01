import { ITEMS } from "../data/ItemDatabase";
import { ShopSystem } from "../systems/ShopSystem";
import type { ShopItem } from "../types/ShopTypes";
import { renderItemIcon } from "../utils/renderItemIcon";

export class UI_ShopManager {
    private system = ShopSystem.getInstance();

    private overlay = document.getElementById("shop-overlay")!;
    private container = document.getElementById("shop-items")!;
    private closeBtn = document.getElementById("shop-close")!;
    private title = document.getElementById("shop-title")!;

    BUY_MESSAGES: Record<string, string> = {
        no_money: "Sem dinheiro!",
        inventory_full: "Inventário cheio!",
        max_slots: "Limite atingido!",
        no_item: "Nao tens esse item!",
    };

    CURRENCY_ICONS: Record<string, string> = {
        coins: "assets/images/Coin.png",
        bossTokens: "assets/images/Boss_Coin.png",
    };

    constructor() {
        this.closeBtn.addEventListener("click", () => this.close());
        this.activateDragScroll();
    }

    open(type: any) {
        console.log("Shop Aberta", type);
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
        const shopItems = this.container;
        shopItems.innerHTML = "";

        shop.items.forEach((item: ShopItem) => {
            const itemData = ITEMS[item.id];
            if (!itemData) return;

            const div = document.createElement("div");
            div.className = "shop-item";

            // icon
            const iconWrapper = document.createElement("div");
            iconWrapper.className = "shop-item-icon";
            renderItemIcon(iconWrapper, item.id);

            div.innerHTML = `
            <div class="shop-item-info">
                <div class="shop-item-name">${itemData.name}</div>
                <div class="shop-item-price">
                    <img src="${this.CURRENCY_ICONS[item.currency]}" alt="${item.currency}" class="price-icon">
                    ${item.price}
                </div>
            </div>
            ${
                shop.mode === "sell"
                    ? `
                        <button class="shop-item-btn sell-one-btn">Vender</button>
                        <button class="shop-item-btn sell-all-btn">Tudo</button>
                    `
                    : `<button class="shop-item-btn buy-btn">Comprar</button>`
            }
        `;

            div.prepend(iconWrapper);

            const buyBtn = div.querySelector(".buy-btn");
            const sellOneBtn = div.querySelector(".sell-one-btn");
            const sellAllBtn = div.querySelector(".sell-all-btn");

            buyBtn?.addEventListener("click", () => {
                const result = this.system.buy(item.id);

                if (result !== "success") {
                    buyBtn.textContent = this.BUY_MESSAGES[result];
                    buyBtn.classList.add("disabled");

                    setTimeout(() => {
                        buyBtn.textContent = "Comprar";
                        buyBtn.classList.remove("disabled");
                    }, 1200);

                    return;
                }

                buyBtn.textContent = "Comprado!";
                setTimeout(() => (buyBtn.textContent = "Comprar"), 800);
            });

            sellOneBtn?.addEventListener("click", () => {
                const result = this.system.sell(item.id);

                if (result !== "success") {
                    sellOneBtn.textContent = this.BUY_MESSAGES[result];
                    sellOneBtn.classList.add("disabled");

                    setTimeout(() => {
                        sellOneBtn.textContent = "Vender";
                        sellOneBtn.classList.remove("disabled");
                    }, 1200);

                    return;
                }

                sellOneBtn.textContent = "Vendido!";
                setTimeout(() => (sellOneBtn.textContent = "Vender"), 800);
            });

            sellAllBtn?.addEventListener("click", () => {
                const result = this.system.sellAll(item.id);

                if (result !== "success") {
                    sellAllBtn.textContent = this.BUY_MESSAGES[result];
                    sellAllBtn.classList.add("disabled");

                    setTimeout(() => {
                        sellAllBtn.textContent = "Tudo";
                        sellAllBtn.classList.remove("disabled");
                    }, 1200);

                    return;
                }

                sellAllBtn.textContent = "Vendido!";
                setTimeout(() => (sellAllBtn.textContent = "Tudo"), 800);
            });

            shopItems.appendChild(div);
        });
    }

    private activateDragScroll() {
        const container = document.querySelector(".shop-items-container");
        if (!container) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        container.addEventListener("mousedown", (e) => {
            isDown = true;
            container.classList.add("active");
            startX =
                (e as MouseEvent).pageX - (container as HTMLElement).offsetLeft;
            scrollLeft = (container as HTMLElement).scrollLeft;
        });

        container.addEventListener("mouseleave", () => {
            isDown = false;
            container.classList.remove("active");
        });

        container.addEventListener("mouseup", () => {
            isDown = false;
            container.classList.remove("active");
        });

        container.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x =
                (e as MouseEvent).pageX - (container as HTMLElement).offsetLeft;
            const walk = (x - startX) * 2;
            (container as HTMLElement).scrollLeft = scrollLeft - walk;
        });
    }
}
