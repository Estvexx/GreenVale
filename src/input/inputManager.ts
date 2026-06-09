import Phaser from "phaser";
import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";
import { UIRoot } from "../UI/UIRoot";
import { LevelSystem } from "../systems/LevelSystem";
import { SaveSystem } from "../systems/SaveSystem";
import { t } from "../i18n";

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
        this.registerInteractionKey();
        this.registerRadialMenu();
        this.registerSaveKeys();
        this.registerTestKeys();
    }

    private registerInventoryKeys() {
        SLOT_KEYS.forEach((keyCode, i) => {
            this.scene.input
                .keyboard!.addKey(keyCode)
                .on("down", () => this.inventory.selectSlot(i));
        });

        this.scene.input.on("wheel", (_: unknown, __: unknown, ___: unknown, deltaY: number) => {
            const next = this.inventory.selectedSlot + (deltaY > 0 ? 1 : -1);
            const clamped = (next + 8) % 8;
            this.inventory.selectSlot(clamped);
        });

        this.scene.input.keyboard?.on("keydown-E", () => {
            this.inventory.toggleInventory();
        });

        this.scene.input.keyboard?.on("keydown-ESC", () => {
            this.inventory.closeInventory();
        });
    }
    private registerInteractionKey() {
        this.scene.input.keyboard?.on("keydown-F", () => this.onInteract?.());
    }

    private registerRadialMenu() {
        this.scene.input.keyboard?.on("keydown-Q", () => UIRoot.effectShop.toggle());
    }

    private registerSaveKeys() {
        this.scene.input.keyboard?.on("keydown-K", () => {
            SaveSystem.save();
            UIRoot.toast.show(t("hud.saved"));
        });
        this.scene.input.keyboard?.on("keydown-M", () => {
            SaveSystem.downloadSaveFile();
            UIRoot.toast.show(t("hud.exported"));
        });
        this.scene.input.keyboard?.on("keydown-L", () => SaveSystem.load());
    }

    private registerTestKeys() {
        this.scene.input.keyboard?.on("keydown-P", () => {
            this.money.add("coins", 100);
            UIRoot.toast.show("+100 coins");
        });
        this.scene.input.keyboard?.on("keydown-O", () => {
            this.money.add("bossTokens", 1);
            UIRoot.toast.show("+1 boss token");
        });
        this.scene.input.keyboard?.on("keydown-U", () => {
            this.level.addXp(100);
            UIRoot.toast.show("+100 XP");
        });
        this.scene.input.keyboard?.on("keydown-I", () => {
            this.inventory.addItem(20, 1);
            UIRoot.toast.show("+1 uva");
        });
    }
}
