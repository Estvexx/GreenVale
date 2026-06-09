import manualHtml from "../html/manual.html?raw";
import { applyTranslations } from "../i18n/index";
import { SoundManager } from "../sounds/SoundsManager";

export class UI_ManualManager {
    private overlay?: HTMLElement;
    private quickOverlay?: HTMLElement;

    constructor() {
        const uiLayer = document.getElementById("ui-layer");
        if (!uiLayer) return;

        uiLayer.insertAdjacentHTML("afterbegin", manualHtml);

        const quickButton = document.getElementById("manual-quick-btn");
        const openButton = document.getElementById("manual-help-btn");
        const quickCloseButton = document.getElementById("manual-quick-close");
        const closeButton = document.getElementById("manual-help-close");
        this.overlay = document.getElementById("manual-help-overlay") ?? undefined;
        this.quickOverlay =
            document.getElementById("manual-quick-overlay") ?? undefined;

        openButton?.classList.remove("hidden");

        quickButton?.addEventListener("click", () => this.openQuick());
        openButton?.addEventListener("click", () => this.open());
        quickCloseButton?.addEventListener("click", () => this.closeQuick());
        closeButton?.addEventListener("click", () => this.close());
        this.quickOverlay?.addEventListener("click", (event) => {
            if (event.target === this.quickOverlay) {
                this.closeQuick();
            }
        });
        this.overlay?.addEventListener("click", (event) => {
            if (event.target === this.overlay) {
                this.close();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                if (!this.isQuickHidden()) {
                    this.closeQuick();
                }

                if (!this.isHidden()) {
                    this.close();
                }
            }
        });

        applyTranslations();
    }

    openQuick() {
        if (!this.quickOverlay) return;

        SoundManager.play("click_sound");
        this.overlay?.classList.add("hidden");
        this.quickOverlay.classList.remove("hidden");
    }

    closeQuick() {
        if (!this.quickOverlay) return;

        SoundManager.play("click_sound");
        this.quickOverlay.classList.add("hidden");
    }

    open() {
        if (!this.overlay) return;

        SoundManager.play("click_sound");
        this.quickOverlay?.classList.add("hidden");
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

    private isQuickHidden() {
        return !!this.quickOverlay?.classList.contains("hidden");
    }
}
