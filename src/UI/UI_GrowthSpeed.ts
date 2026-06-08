import { TimeSystem } from "../systems/TimeSystem";

export class UI_GrowthSpeed {
    private time = TimeSystem.getInstance();
    private hud = document.getElementById("growth-hud")!;
    private speedEl = document.getElementById("growth-speed")!;

    constructor() {
        this.hud.classList.remove("hidden");
        this.time.onChange(() => this.render());
        this.render();
    }

    private render() {
        const hour = this.time.getHour();
        const isNight = hour >= 21 || hour < 6;

        if (isNight) {
            this.speedEl.textContent = "Lento (-3×)";
            this.speedEl.className = "slow";
        } else {
            this.speedEl.textContent = "Normal";
            this.speedEl.className = "normal";
        }
    }
}
