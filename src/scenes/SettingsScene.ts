import Phaser from "phaser";
import { FarmScene } from "./FarmScene";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: "SettingsScene" });
    }

    create() {
        this.add
            .text(this.scale.width - 32, 32, "⚙️", { fontSize: "28px" })
            .setOrigin(1, 0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => this.openSettings());

        document
            .getElementById("close-settings")
            ?.addEventListener("click", () => this.closeSettings());

        this.input.keyboard?.on("keydown-ESC", () => this.closeSettings());

        document
            .getElementById("toggle-music")
            ?.addEventListener("change", (e) => {
                const farmScene = this.scene.get("FarmScene") as FarmScene;
                const target = e.target as HTMLInputElement;

                if (target.checked) {
                    farmScene.bgMusic.resume();
                } else {
                    farmScene.bgMusic.pause();
                }
            });
    }

    private openSettings() {
        document.getElementById("settings-menu")?.classList.remove("hidden");

        import("../i18n").then(({ applyTranslations }) => {
            applyTranslations();
        });

        this.scene.pause("FarmScene");
    }

    private closeSettings() {
        document.getElementById("settings-menu")?.classList.add("hidden");

        const farmScene = this.scene.get("FarmScene") as FarmScene;
        farmScene.player.applySkin();

        farmScene.player.controlScheme =
            localStorage.getItem("controlScheme") || "wasd";

        this.scene.resume("FarmScene");
    }
}
