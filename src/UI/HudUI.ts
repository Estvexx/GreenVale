import Phaser from "phaser";

export class HudUI extends Phaser.Scene {
    constructor() {
        super({ key: "hud-ui" });
    }

    create() {
        this.add
            .text(this.scale.width - 50, 50, "⚙️", {
                fontSize: "28px",
            })
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => {
                this.scene.pause("main-scene");
                this.scene.launch("settings-scene");
            });
    }
}
