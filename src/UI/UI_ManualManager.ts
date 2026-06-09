import manualHtml from "../html/manual.html?raw";
import { applyTranslations } from "../i18n/index";
import { SoundManager } from "../sounds/SoundsManager";

export class UI_ManualManager {
    private overlay?: HTMLElement;

    constructor() {
        const uiLayer = document.getElementById("ui-layer");
        if (!uiLayer) return;

        uiLayer.insertAdjacentHTML("afterbegin", manualHtml);

        const openButton = document.getElementById("manual-help-btn");
        const closeButton = document.getElementById("manual-help-close");
        this.overlay = document.getElementById("manual-help-overlay") ?? undefined;

        openButton?.classList.remove("hidden");

        openButton?.addEventListener("click", () => this.open());
        closeButton?.addEventListener("click", () => this.close());
        this.overlay?.addEventListener("click", (event) => {
            if (event.target === this.overlay) {
                this.close();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !this.isHidden()) {
                this.close();
            }
        });

        applyTranslations();
    }

    open() {
        if (!this.overlay) return;

        SoundManager.play("click_sound");
        this.overlay.classList.remove("hidden");
    }

    close() {
        if (!this.overlay) return;

        SoundManager.play("click_sound");
        this.overlay.classList.add("hidden");
    }

    private isHidden() {
        return !!this.overlay?.classList.contains("hidden");
    }
}
