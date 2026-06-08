import { TimeSystem } from "../systems/TimeSystem";

export class UI_GrowthSpeed {
    private clock   = TimeSystem.getInstance();
    private hud     = document.getElementById("growth-hud")!;
    private label   = document.getElementById("growth-speed")!;

    constructor() {
        this.hud.classList.remove("hidden");
        this.clock.onChange(() => this.refresh());
        this.refresh();
    }

    private refresh() {
        const h       = this.clock.getHour();
        const isNight = h >= 21 || h < 6;

        this.label.textContent = isNight ? "Lento (-3×)" : "Normal";
        this.label.className   = isNight ? "slow" : "normal";
    }
}
