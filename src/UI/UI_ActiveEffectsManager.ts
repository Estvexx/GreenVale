import { EffectSystem } from "../systems/EffectsSystem";
import type { Effect } from "../types/Effect";
import { t } from "../i18n/index";

export class UI_ActiveEffectsManager {
    private effects = EffectSystem.getInstance();

    private panel = document.getElementById("active-effects-panel")!;
    private list = document.getElementById("active-effects-list")!;

    private icons: Record<string, string> = {
        speed: "assets/images/potions/Potion_of_speed.png",
        damage: "assets/images/potions/Potion_of_damage.png",
        growth: "assets/images/potions/Potion_of_growth.png",
        seed_discount: "assets/images/potions/Potion_of_discount.png",
    };

    constructor() {
        this.effects.onChange(() => this.render());
        this.panel.classList.remove("hidden");

        this.render();

        setInterval(() => {
            this.render();
        }, 1000);
    }

    private render() {
        const effects = this.effects.getEffects();

        this.list.innerHTML = "";

        if (effects.length === 0) {
            this.panel.classList.add("effects-empty");
            return;
        }

        this.panel.classList.remove("effects-empty");

        effects.forEach((effect) => {
            this.list.appendChild(this.createEffectElement(effect));
        });
    }

    private createEffectElement(effect: Effect): HTMLElement {
        const div = document.createElement("div");

        div.className = "active-effect-item";

        div.innerHTML = `
            <img
                src="${this.getIcon(effect.icon)}"
                alt="${t(effect.nameKey)}"
                class="active-effect-icon"
            />

            <div class="active-effect-info">
                <span class="active-effect-name">
                    ${t(effect.nameKey)}
                </span>

                <span class="active-effect-time">
                    ${this.getTimeText(effect)}
                </span>
            </div>
        `;

        return div;
    }

    private getIcon(icon: string): string {
        return this.icons[icon] ?? icon;
    }

    private getTimeText(effect: Effect): string {
        if (effect.permanent) {
            return t("common.permanent");
        }

        const seconds = this.effects.getRemainingSeconds(effect.id);

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
}
