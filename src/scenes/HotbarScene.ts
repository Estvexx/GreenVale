import Phaser from "phaser";
import { InventorySystem } from "../systems/InventorySystem";

const SLOT_SIZE = 64;
const SLOT_PADDING = 8;

export class HotbarScene extends Phaser.Scene {
    private inventory!: InventorySystem;
    private slots: Phaser.GameObjects.Rectangle[] = [];
    private slotIcons: (Phaser.GameObjects.Image | null)[] = [];

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
                0.9,
            );
            slot.setStrokeStyle(3, 0xffffff, 0.8);
            slot.setInteractive();

            slot.on("pointerdown", () => {
                this.inventory.selectSlot(i);
                this.updateSelection();
            });

            this.slots.push(slot);
            this.slotIcons.push(null);
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

        this.updateUI();
        this.updateSelection();
    }

    updateUI() {
        for (let i = 0; i < this.slots.length; i++) {
            const item = this.inventory.slots[i];

            // Remove ícone antigo se existir
            if (this.slotIcons[i]) {
                this.slotIcons[i]!.destroy();
                this.slotIcons[i] = null;
            }

            // Se tem item, cria novo ícone
            if (item) {
                const x = this.slots[i].x;
                const y = this.slots[i].y;

                const icon = this.add.image(x, y, item.icon);
                icon.setDisplaySize(SLOT_SIZE, SLOT_SIZE); // 52x52 (margem 6px)
                this.slotIcons[i] = icon;
            }
        }
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
