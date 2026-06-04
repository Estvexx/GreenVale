import { EffectSystem } from "../systems/EffectsSystem";

export class UI_ActiveEffectsManager {
    private effects = EffectSystem.getInstance();

    private panel = document.getElementById("active-effects-panel")!;
    private list = document.getElementById("active-effects-list")!;

    private effectIcons: Record<string, string> = {
        speed: "assets/images/potions/Potion_of_speed.png",
        damage: "assets/images/potions/Potion_of_damage.png",
        growth: "assets/images/potions/Potion_of_growth.png",
        seed_discount: "assets/images/potions/Potion_of_discount.png",
    };

    constructor() {
        this.effects.onChange(() => {
            this.render();
        });

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
            const div = document.createElement("div");
            div.className = "active-effect-item";

            div.innerHTML = `
                <img
                    src="${this.getEffectIcon(effect.icon)}"
                    alt="${effect.name}"
                    class="active-effect-icon"
                />

                <div class="active-effect-info">
                    <span class="active-effect-name">
                        ${effect.name}
                    </span>

                    <span class="active-effect-time">
                        ${this.getEffectTime(effect)}
                    </span>
                </div>
            `;

            this.list.appendChild(div);
        });
    }

    private getEffectIcon(icon: string): string {
        return this.effectIcons[icon] ?? icon;
    }

    private getEffectTime(effect: {
        id: string;
        permanent: boolean;
        expiresAt?: number;
    }): string {
        if (effect.permanent) {
            return "Permanente";
        }

        if (!effect.expiresAt) {
            return "";
        }

        const remainingMs = effect.expiresAt - Date.now();

        if (remainingMs <= 0) {
            return "00:00";
        }

        const totalSeconds = Math.floor(remainingMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}
