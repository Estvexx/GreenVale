import { EffectShopSystem } from "../systems/EffetsShopSystem";
import { EFFECT_SHOP_ITEMS } from "../data/shops/effectsShop";

export class UI_EffectShopManager {
    private system = EffectShopSystem.getInstance();

    private overlay = document.getElementById("radial-overlay")!;
    private menu = document.getElementById("effect-radial-menu")!;
    private toast = document.getElementById("effect-toast")!;

    private isOpen = false;
    private toastTimeout?: ReturnType<typeof setTimeout>;

    private messages: Record<string, string> = {
        success: "Efeito comprado!",
        no_money: "Boss tokens insuficientes!",
        invalid_effect: "Efeito indisponivel.",
    };

    constructor() {
        this.render();
        this.close();
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.remove("hidden");
    }

    close() {
        this.isOpen = false;
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
                        alt="${shopItem.effect.name}"
                        class="radial-potion-icon"
                    />

                    <span class="radial-potion-name">
                        ${shopItem.effect.name}
                    </span>

                    <span class="radial-potion-duration">
                        ${this.formatDuration(shopItem)}
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
                    this.showToast(this.messages[result], "error");
                    button.classList.add("error");

                    setTimeout(() => {
                        button.classList.remove("error");
                    }, 500);

                    return;
                }

                this.showToast(this.messages.success, "success");
                button.classList.add("bought");

                setTimeout(() => {
                    button.classList.remove("bought");
                }, 500);
            });

            this.menu.appendChild(li);
        });
    }

    private showToast(message: string, type: "success" | "error") {
        clearTimeout(this.toastTimeout);

        this.toast.textContent = message;
        this.toast.className = `effect-toast ${type}`;

        this.toastTimeout = setTimeout(() => {
            this.toast.classList.add("hidden");
        }, 1800);
    }

    private formatDuration(shopItem: {
        durationMs?: number;
        effect: { permanent: boolean };
    }): string {
        if (shopItem.effect.permanent) {
            return "Permanente";
        }

        if (!shopItem.durationMs) {
            return "";
        }

        const totalSeconds = Math.floor(shopItem.durationMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}
