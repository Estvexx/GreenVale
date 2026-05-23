import Phaser from "phaser";
import { FarmScene } from "./FarmScene";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: "SettingsScene" });
    }

    create() {
        this.add
            .text(this.scale.width - 16, 16, "⚙️", { fontSize: "28px" })
            .setOrigin(1, 0)
            .setDepth(100)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => this.openSettings());

        document
            .getElementById("close-settings")
            ?.addEventListener("click", () => this.closeSettings());

        this.input.keyboard?.on("keydown-ESC", () => this.closeSettings());
    }

    private openSettings() {
        document.getElementById("settings-menu")?.classList.remove("hidden");
        this.scene.pause("FarmScene");
    }

    private closeSettings() {
        document.getElementById("settings-menu")?.classList.add("hidden");

        const farmScene = this.scene.get("FarmScene") as FarmScene;
        farmScene.player.applySkin();

        this.scene.resume("FarmScene");
    }
}