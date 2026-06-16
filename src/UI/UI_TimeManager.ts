import { TimeSystem } from "../systems/TimeSystem";
import { t } from "../i18n";

export class UI_TimeManager {
    private time = TimeSystem.getInstance();

    private timeHud = document.getElementById("time-hud")!;
    private dayText = document.getElementById("time-day")!;
    private clockText = document.getElementById("time-clock")!;

    constructor() {
        this.timeHud.classList.remove("hidden");
        this.time.onChange(() => {
            this.render();
        });
        window.addEventListener("greenvale:languagechange", this.render);

        this.render();
    }

    private render = () => {
        this.dayText.textContent = t("time.day").replace(
            "{day}",
            String(this.time.getDay()),
        );

        this.clockText.textContent = this.time.getTimeText();
    };
}
