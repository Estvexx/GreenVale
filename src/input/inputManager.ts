import Phaser from "phaser";
import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";

const SLOT_KEYS = [
    Phaser.Input.Keyboard.KeyCodes.ONE,
    Phaser.Input.Keyboard.KeyCodes.TWO,
    Phaser.Input.Keyboard.KeyCodes.THREE,
    Phaser.Input.Keyboard.KeyCodes.FOUR,
    Phaser.Input.Keyboard.KeyCodes.FIVE,
    Phaser.Input.Keyboard.KeyCodes.SIX,
    Phaser.Input.Keyboard.KeyCodes.SEVEN,
    Phaser.Input.Keyboard.KeyCodes.EIGHT,
];

export class InputManager {
    private scene: Phaser.Scene;
    private inventory = InventorySystem.getInstance();
    private money = MoneySystem.getInstance();

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.registerInventoryKeys();
        this.addMoneyTestKeys();
        this.addItemTestKeys();
    }

    private registerInventoryKeys() {
        SLOT_KEYS.forEach((keyCode, i) => {
            this.scene.input
                .keyboard!.addKey(keyCode)
                .on("down", () => this.inventory.selectSlot(i));
        });

        this.scene.input.keyboard?.on("keydown-E", () => {
            this.inventory.toggleInventory();
        });

        this.scene.input.keyboard?.on("keydown-ESC", () => {
            this.inventory.closeInventory();
        });
    }

    private addMoneyTestKeys() {
        this.scene.input.keyboard?.on("keydown-P", () => {
            this.money.add("coins", 100);
            console.log("+100 coins");
        });

        this.scene.input.keyboard?.on("keydown-O", () => {
            this.money.add("bossTokens", 1);
            console.log("+1 boss token");
        });
    }

    private addItemTestKeys() {
        this.scene.input.keyboard?.on("keydown-I", () => {
            this.inventory.addItem(20, 1);
            console.log("+1 item vendavel");
        });
    }
}
