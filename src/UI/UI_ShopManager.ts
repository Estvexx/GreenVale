import { ITEMS } from "../data/ItemDatabase";
import { TOOL_SKINS } from "../data/ToolSkinDatabase";
import { ShopSystem } from "../systems/ShopSystem";
import { ToolSkinSystem } from "../systems/ToolSkinSystem";
import type { Shop, ShopItem, ShopType } from "../types/ShopTypes";
import { renderItemIcon } from "../utils/renderItemIcon";
import { UIRoot } from "./UIRoot";
import { t } from "../i18n/index";
import { SoundManager } from "../sounds/SoundsManager";
import { EffectSystem } from "../systems/EffectsSystem";

export class UI_ShopManager {
    private system = ShopSystem.getInstance();

    private overlay = document.getElementById("shop-overlay")!;
    private container = document.getElementById("shop-items")!;
    private closeBtn = document.getElementById("shop-close")!;
    private title = document.getElementById("shop-title")!;

    private readonly messages: Record<string, string> = {
        success_buy: "shop.messages.bought",
        success_sell: "shop.messages.sold",
        no_money: "shop.messages.noMoney",
        inventory_full: "shop.messages.inventoryFull",
        max_slots: "shop.messages.maxSlots",
        no_item: "shop.messages.noItem",
        already_owned: "shop.skinApplied",
        already_have: "shop.alreadyHave",
        invalid_skin: "shop.skinUnavailable",
    };

    private readonly currencyIcons: Record<string, string> = {
        coins: "assets/images/Coin.png",
        bossTokens: "assets/images/Boss_Coin.png",
    };

    constructor() {
        this.closeBtn.addEventListener("click", () => this.close());
        this.activateDragScroll();
    }

    open(type: ShopType) {
        SoundManager.play("click_sound");
        const shop = this.system.open(type);

        if (!shop) return;

        this.overlay.classList.remove("hidden");

        this.title.textContent = shop.nameKey ? t(shop.nameKey) : shop.name;

        this.render(shop);
    }

    close() {
        SoundManager.play("click_sound");
        this.system.close();
        this.overlay.classList.add("hidden");
        this.container.innerHTML = "";
    }

    private render(shop: Shop) {
        this.container.innerHTML = "";

        shop.items.forEach((item: ShopItem) => {
            const itemData = item.id ? ITEMS[item.id] : null;
            const skinData = item.skinId ? TOOL_SKINS[item.skinId] : null;

            if (!itemData && !skinData) return;

            const div = document.createElement("div");
            div.className = "shop-item";

            const iconWrapper = document.createElement("div");
            iconWrapper.className = "shop-item-icon";

            if (item.id) {
                renderItemIcon(iconWrapper, item.id);
            } else if (skinData) {
                const icon = skinData.icon ?? Object.values(skinData.icons ?? {})[0];

                if (icon) {
                    const img = document.createElement("img");
                    img.src = icon;
                    img.alt = skinData.name;
                    iconWrapper.appendChild(img);
                }
            }

            const itemName = skinData
                ? skinData.nameKey
                    ? t(skinData.nameKey)
                    : skinData.name
                : itemData!.nameKey
                  ? t(itemData!.nameKey)
                  : itemData!.name;

            const isOwnedSkin = item.skinId
                ? ToolSkinSystem.getInstance().isOwned(item.skinId)
                : false;

            const discount = shop.id === "sementes" ? EffectSystem.getInstance().getSeedDiscountMultiplier() : 1;
            const displayPrice = Math.floor(item.price * discount);
            const priceHtml = discount < 1
                ? `${displayPrice} <span style="text-decoration:line-through;opacity:0.45;font-size:0.8em;margin-left:4px">${item.price}</span>`
                : `${displayPrice}`;

            div.innerHTML = `
                <div class="shop-item-info">
                    <div class="shop-item-name">${itemName}</div>

                    <div class="shop-item-price">
                        <img
                            src="${this.currencyIcons[item.currency]}"
                            alt="${item.currency}"
                            class="price-icon"
                        />
                        ${priceHtml}
                    </div>
                </div>

                ${
                    shop.mode === "sell"
                        ? `
                            <button class="shop-item-btn sell-one-btn">
                                ${t("shop.sell")}
                            </button>

                            <button class="shop-item-btn sell-all-btn">
                                ${t("shop.sellAll")}
                            </button>
                        `
                        : `
                            <button class="shop-item-btn buy-btn">
                                ${isOwnedSkin ? t("shop.select") : t("shop.buy")}
                            </button>
                        `
                }
            `;

            div.prepend(iconWrapper);

            const buyBtn = div.querySelector<HTMLButtonElement>(".buy-btn");
            const sellOneBtn =
                div.querySelector<HTMLButtonElement>(".sell-one-btn");
            const sellAllBtn =
                div.querySelector<HTMLButtonElement>(".sell-all-btn");

            buyBtn?.addEventListener("click", () => {
                SoundManager.play("click_sound");
                const result = this.system.buy(item.skinId ?? item.id!);

                if (result !== "success") {
                    if (result === "already_owned") {
                        this.render(shop);
                        UIRoot.toast.info(t("shop.skinApplied"));
                        return;
                    }

                    this.showError(result);
                    return;
                }

                this.render(shop);
                UIRoot.toast.success(
                    shop.id === "upgrades"
                        ? t("shop.skinBought")
                        : t(this.messages.success_buy),
                );

                if (shop.id === "sementes" || shop.id === "ferragens") {
                    setTimeout(() => {
                        UIRoot.toast.info("+1 XP");
                    }, 2000);
                }
            });

            sellOneBtn?.addEventListener("click", () => {
                SoundManager.play("click_sound");
                const result = this.system.sell(item.id!);

                if (result !== "success") {
                    this.showError(result);
                    return;
                }

                UIRoot.toast.success(t(this.messages.success_sell));
            });

            sellAllBtn?.addEventListener("click", () => {
                SoundManager.play("click_sound");
                const result = this.system.sellAll(item.id!);

                if (result !== "success") {
                    this.showError(result);
                    return;
                }

                UIRoot.toast.success(t(this.messages.success_sell));
            });

            this.container.appendChild(div);
        });
    }

    private showError(result: string) {
        const messageKey = this.messages[result];

        UIRoot.toast.error(messageKey ? t(messageKey) : result);
        SoundManager.play("error_sound");
    }

    private activateDragScroll() {
        const container = document.querySelector<HTMLElement>(
            ".shop-items-container",
        );

        if (!container) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        container.addEventListener("mousedown", (e) => {
            isDown = true;
            container.classList.add("active");

            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
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

            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;

            container.scrollLeft = scrollLeft - walk;
        });
    }
}
