import Phaser from "phaser";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super("settings-scene");
    }

    create() {
        this.add
            .text(this.scale.width - 20, 20, "⚙️", { fontSize: "28px" })
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => {
                const menu = document.getElementById("settings-menu");
                menu?.classList.toggle("hidden");

                if (!menu?.classList.contains("hidden")) {
                    this.scene.pause("main-scene");
                } else {
                    this.scene.resume("main-scene");
                }
            });

        document
            .getElementById("close-settings")
            ?.addEventListener("click", () => {
                document
                    .getElementById("settings-menu")
                    ?.classList.add("hidden");
                this.scene.resume("main-scene");
            });
    }
}
