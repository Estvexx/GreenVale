import Phaser from "phaser";
import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";
import { UIRoot } from "../UI/UIRoot";
import { LevelSystem } from "../systems/LevelSystem";

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
    private level = LevelSystem.getInstance();

    private onInteract?: () => void;

    constructor(scene: Phaser.Scene, onInteract?: () => void) {
        this.scene = scene;
        this.onInteract = onInteract;
        this.registerInventoryKeys();
        this.addMoneyTestKeys();
        this.addItemTestKeys();
        this.OpenRadialMenuKey();
        this.addXP();
        this.registerInteractionKey();
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
    private OpenRadialMenuKey() {
        this.scene.input.keyboard?.on("keydown-Q", () => {
            UIRoot.effectShop.toggle();
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

    private addXP() {
        this.scene.input.keyboard?.on("keydown-U", () => {
            this.level.addXp(100);
            console.log("+100 XP");
        });
    }

    private addItemTestKeys() {
        this.scene.input.keyboard?.on("keydown-I", () => {
            this.inventory.addItem(20, 1);
            console.log("+1 item vendavel");
        });
    }

    private registerInteractionKey() {
        this.scene.input.keyboard?.on("keydown-F", () => {
            this.onInteract?.();
        });
    }
}
