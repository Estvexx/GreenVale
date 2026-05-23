import Phaser from "phaser";
import { InventorySystem } from "../systems/InventorySystem";

const SLOT_SIZE = 64;
const SLOT_PADDING = 8;

export class HotbarScene extends Phaser.Scene {
    private inventory!: InventorySystem;
    private slots: Phaser.GameObjects.Rectangle[] = [];

    constructor() {
        super({ key: "HotbarScene" });
    }

    create() {
        this.inventory = InventorySystem.getInstance();

        // Criar os 8 slots
        const startX =
            this.scale.width / 2 - (SLOT_SIZE * 8 + SLOT_PADDING * 7) / 2;
        const startY = this.scale.height - SLOT_SIZE - 20;

        for (let i = 0; i < 8; i++) {
            const x = startX + i * (SLOT_SIZE + SLOT_PADDING);
            const y = startY;

            const slot = this.add.rectangle(
                x,
                y,
                SLOT_SIZE,
                SLOT_SIZE,
                0x333333,
                0.6,
            );
            slot.setStrokeStyle(3, 0xffffff, 0.8);
            slot.setInteractive();

            slot.on("pointerdown", () => {
                this.inventory.selectSlot(i);
                this.updateSelection();
            });

            this.slots.push(slot);
        }

        const keyCodes = [
            Phaser.Input.Keyboard.KeyCodes.ONE,
            Phaser.Input.Keyboard.KeyCodes.TWO,
            Phaser.Input.Keyboard.KeyCodes.THREE,
            Phaser.Input.Keyboard.KeyCodes.FOUR,
            Phaser.Input.Keyboard.KeyCodes.FIVE,
            Phaser.Input.Keyboard.KeyCodes.SIX,
            Phaser.Input.Keyboard.KeyCodes.SEVEN,
            Phaser.Input.Keyboard.KeyCodes.EIGHT,
        ];

        for (let i = 0; i < keyCodes.length; i++) {
            const key = this.input.keyboard!.addKey(keyCodes[i]);
            key.on("down", () => {
                this.inventory.selectSlot(i);
                this.updateSelection();
            });
        }

        this.updateSelection();
    }

    updateSelection() {
        for (let i = 0; i < this.slots.length; i++) {
            const isSelected = i === this.inventory.selectedSlot;
            //const color = isSelected ? 0x44aa44 : 0x333333;
            //this.slots[i].setFillStyle(color);
            const lineWidth = isSelected ? 3 : 1;
            const lineColor = isSelected ? 0xffaa44 : 0xffffff;
            this.slots[i].setStrokeStyle(lineWidth, lineColor);
        }
    }
}
