import Phaser from "phaser";
import { MoneySystem } from "../systems/MoneySystem";

export class HudUI extends Phaser.Scene {
    private balanceText!: Phaser.GameObjects.Text;
    private money!: MoneySystem;

    constructor() {
        super({ key: "hud-ui" });
    }

    create() {
        this.money = MoneySystem.getInstance();

        this.add
            .rectangle(70, 20, 140, 42, 0x000000, 0.65)
            .setOrigin(0.5, 0)
            .setDepth(100)
            .setStrokeStyle(2, 0xffd700, 0.8);

        this.add
            .text(45, 41, "🪙", {
                fontSize: "24px",
                stroke: "#000000",
                strokeThickness: 3,
            })
            .setOrigin(0.5, 0.5)
            .setDepth(101);

        this.balanceText = this.add
            .text(95, 41, `${this.money.getBalance()}`, {
                fontSize: "22px",
                color: "#FFD700",
                fontFamily: "monospace",
                fontStyle: "bold",
                stroke: "#000000",
                strokeThickness: 3,
            })
            .setOrigin(0.5, 0.5)
            .setDepth(101);

        this.money.onChange((balance) => {
            this.balanceText.setText(`${balance}`);
        });
    }
}
