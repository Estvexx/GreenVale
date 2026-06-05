import {
    EffectShopSystem,
    type EffectBuyResult,
} from "../systems/EffectShopSystem";
import { EFFECT_SHOP_ITEMS } from "../data/shops/effectsShop";
import { UIRoot } from "./UIRoot";
import { t } from "../i18n/index";
import { SoundManager } from "../sounds/SoundsManager";

export class UI_EffectShopManager {
    private system = EffectShopSystem.getInstance();

    private overlay = document.getElementById("radial-overlay")!;
    private menu = document.getElementById("effect-radial-menu")!;

    private isOpen = false;

    private messages: Record<EffectBuyResult, string> = {
        success: "effectShop.success",
        no_money: "effectShop.noMoney",
        invalid_effect: "effectShop.invalidEffect",
    };

    constructor() {
        this.render();
        this.close();
    }

    open() {
        SoundManager.play("click_sound");
        this.isOpen = true;
        this.overlay.classList.remove("hidden");
    }

    close() {
        this.isOpen = false;
        SoundManager.play("click_sound");
        this.overlay.classList.add("hidden");
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    private render() {
        this.menu.innerHTML = "";

        Object.values(EFFECT_SHOP_ITEMS).forEach((shopItem) => {
            const li = document.createElement("li");

            li.innerHTML = `
                <a class="${shopItem.action} radial-item" href="#" data-action="${shopItem.action}">
                    <img
                        src="${shopItem.potionIcon}"
                        alt="${t(shopItem.effect.nameKey)}"
                        class="radial-potion-icon"
                    />

                    <span class="radial-potion-name">
                        ${t(shopItem.effect.nameKey)}
                    </span>

                    <span class="radial-potion-duration">
                        ${this.formatDuration(shopItem.durationMs, shopItem.effect.permanent)}
                    </span>

                    <span class="radial-potion-price">
                        <img
                            src="${shopItem.currencyIcon}"
                            alt="${shopItem.currency}"
                            class="radial-currency-icon"
                        />
                        ${shopItem.price}
                    </span>
                </a>
            `;

            const button = li.querySelector<HTMLAnchorElement>(".radial-item")!;

            button.addEventListener("click", (e) => {
                e.preventDefault();

                const action = button.dataset.action;
                if (!action) return;

                const result = this.system.buy(action);

                if (result !== "success") {
                    UIRoot.toast.error(t(this.messages[result]));
                    SoundManager.play("error_sound");
                    return;
                }

                UIRoot.toast.success(t(this.messages[result]));
            });

            this.menu.appendChild(li);
        });
    }

    private formatDuration(
        durationMs: number | undefined,
        permanent: boolean,
    ): string {
        if (permanent) return t("common.permanent");
        if (!durationMs) return "";

        const totalSeconds = Math.floor(durationMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}
