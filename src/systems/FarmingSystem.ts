import Phaser from "phaser";
import { InventorySystem } from "./InventorySystem";
import { FarmFieldSystem } from "./FarmFieldSystem";
import { ITEMS } from "../data/ItemDatabase";
import { LevelSystem } from "./LevelSystem";
import { TimeSystem } from "./TimeSystem";
import { UIRoot } from "../UI/UIRoot";

const TOOL_HOE          = 1;
const TOOL_SCYTHE       = 2;
const TOOL_BUCKET_EMPTY = 3;
const TOOL_BUCKET_WATER = 4;

// À noite as plantas crescem 3x mais devagar
const NIGHT_GROW_MULTIPLIER = 3;

type PlantedCrop = {
    sprite: Phaser.GameObjects.Image;
    icon: Phaser.GameObjects.Image;
    iconBubble: Phaser.GameObjects.Arc;
    seedId: number;
    stage: number;
    watered: boolean;
    lastGrowTime: number;
};

const TILE_SIZE = 32;
const MAX_PLANT_DISTANCE = 80;

export class FarmingSystem {
    private scene: Phaser.Scene;
    private farmFields: FarmFieldSystem;
    private inventory = InventorySystem.getInstance();
    private levelSystem = LevelSystem.getInstance();
    private timeSystem = TimeSystem.getInstance();

    private crops = new Map<string, PlantedCrop>();
    private pendingPlantX = 0;
    private pendingPlantY = 0;

    private tileCursor: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, farmFields: FarmFieldSystem) {
        this.scene = scene;
        this.farmFields = farmFields;

        this.tileCursor = scene.add.rectangle(0, 0, TILE_SIZE, TILE_SIZE)
            .setStrokeStyle(2, 0xffffff, 0.8)
            .setFillStyle(0xffffff, 0.15)
            .setDepth(15)
            .setVisible(false);

        scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.onPointerDown(pointer);
        });
    }

    canWaterAt(playerX: number, playerY: number): boolean {
        const item = this.inventory.getCurrentItem();
        if (!item || ITEMS[item.id]?.id !== TOOL_BUCKET_WATER) return false;
        const crop = this.crops.get(this.cellKey(playerX, playerY));
        return !!crop && !crop.watered;
    }

    interact(playerX: number, playerY: number) {
        const item = this.inventory.getCurrentItem();
        if (!item) return;

        const itemData = ITEMS[item.id];
        if (!itemData) return;

        if (itemData.id === TOOL_HOE)           this.openSeedPicker(playerX, playerY);
        if (itemData.id === TOOL_BUCKET_WATER)  this.tryWater(playerX, playerY);
        if (itemData.id === TOOL_SCYTHE)        this.tryHarvest(playerX, playerY);
    }

    update(time: number, playerX: number, playerY: number) {
        this.updateCursor(playerX, playerY);
        const isNight = this.isNight();

        for (const crop of this.crops.values()) {
            if (!crop.watered || crop.stage === 3) continue;

            const baseGrowTime = ITEMS[crop.seedId]?.growTime;
            if (!baseGrowTime) continue;

            const growTime = isNight ? baseGrowTime * NIGHT_GROW_MULTIPLIER : baseGrowTime;

            if (time - crop.lastGrowTime >= growTime) {
                crop.stage++;
                crop.watered = false;
                crop.lastGrowTime = time;
                this.updateCropFrame(crop);
                this.updateIcon(crop);
            }
        }
    }

    private openSeedPicker(x: number, y: number) {
        if (!this.farmFields.canFarmAt(x, y)) {
            const required = this.farmFields.getRequiredLevelAt(x, y);
            if (required) {
                UIRoot.toast.show(`Nível ${required} necessário para plantar aqui.`, "error");
            }
            return;
        }

        const key = this.cellKey(x, y);
        if (this.crops.has(key)) {
            // enxada em cima de planta existente arranca-a
            this.tryUproot(x, y);
            return;
        }

        this.pendingPlantX = x;
        this.pendingPlantY = y;

        const opened = UIRoot.seedPicker.open((seedId) => {
            this.tryPlant(this.pendingPlantX, this.pendingPlantY, seedId);
        });

        if (!opened) {
            UIRoot.toast.show("Não tens sementes no inventário.", "error");
        }
    }

    private tryPlant(x: number, y: number, seedId: number) {
        if (!this.farmFields.canFarmAt(x, y)) return;

        const key = this.cellKey(x, y);
        if (this.crops.has(key)) return;

        const itemData = ITEMS[seedId];
        if (!itemData?.cropKey) return;

        if (this.inventory.getItemQuantity(seedId) <= 0) return;

        const cx = this.snap(x);
        const cy = this.snap(y);

        const sprite = this.scene.add.image(cx, cy, `crop_${itemData.cropKey}_0`);
        sprite.setDepth(8);

        const { icon, iconBubble } = this.createIcon(cx, cy, "icon_water");

        this.crops.set(key, {
            sprite,
            icon,
            iconBubble,
            seedId,
            stage: 0,
            watered: false,
            lastGrowTime: this.scene.time.now,
        });

        this.inventory.removeItemById(seedId, 1);
        this.levelSystem.addXp(5);
    }

    private tryWater(x: number, y: number) {
        const crop = this.crops.get(this.cellKey(x, y));
        if (!crop || crop.watered) return;

        crop.watered = true;
        crop.lastGrowTime = this.scene.time.now;
        crop.icon.setVisible(false);
        crop.iconBubble.setVisible(false);
        this.inventory.removeItemById(TOOL_BUCKET_WATER, 1);
        this.inventory.addItem(TOOL_BUCKET_EMPTY, 1);
    }

    private tryHarvest(x: number, y: number) {
        const key = this.cellKey(x, y);
        const crop = this.crops.get(key);
        if (!crop) return;

        if (crop.stage !== 3) {
            UIRoot.toast.show("A planta ainda não está pronta.", "error");
            return;
        }

        const harvestId = ITEMS[crop.seedId]?.harvestId;
        if (harvestId) {
            this.inventory.addItem(harvestId, 1);
            this.levelSystem.addXp(20);
        }

        // volta para stage 2 (grande sem fruto), rega para voltar ao 3
        crop.stage = 2;
        crop.watered = false;
        this.updateCropFrame(crop);
        this.updateIcon(crop);
    }

    private tryUproot(x: number, y: number) {
        const key = this.cellKey(x, y);
        const crop = this.crops.get(key);
        if (!crop) return;

        crop.sprite.destroy();
        crop.icon.destroy();
        crop.iconBubble.destroy();
        this.crops.delete(key);
    }

    private updateCropFrame(crop: PlantedCrop) {
        const cropKey = ITEMS[crop.seedId]?.cropKey;
        if (cropKey) {
            crop.sprite.setTexture(`crop_${cropKey}_${crop.stage}`);
        }
    }

    private updateIcon(crop: PlantedCrop) {
        if (crop.stage === 3) {
            crop.icon.setTexture("icon_scythe").setVisible(true);
            crop.iconBubble.setVisible(true);
        } else if (!crop.watered) {
            crop.icon.setTexture("icon_water").setVisible(true);
            crop.iconBubble.setVisible(true);
        } else {
            crop.icon.setVisible(false);
            crop.iconBubble.setVisible(false);
        }
    }

    private createIcon(x: number, y: number, texture: string): { icon: Phaser.GameObjects.Image; iconBubble: Phaser.GameObjects.Arc } {
        const iconBubble = this.scene.add.circle(x, y - 28, 12, 0xffffff).setDepth(19);
        const icon = this.scene.add.image(x, y - 28, texture).setDepth(20).setScale(0.5);
        return { icon, iconBubble };
    }

    private updateCursor(playerX: number, playerY: number) {
        const item = this.inventory.getCurrentItem();
        const itemId = item ? ITEMS[item.id]?.id : null;
        const isHoe = itemId === TOOL_HOE;
        const isScythe = itemId === TOOL_SCYTHE;

        if (!isHoe && !isScythe) {
            this.tileCursor.setVisible(false);
            this.scene.input.setDefaultCursor("default");
            return;
        }

        this.scene.input.setDefaultCursor("default");

        const pointer = this.scene.input.activePointer;
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;

        const tx = this.snap(worldX);
        const ty = this.snap(worldY);

        const dist = Phaser.Math.Distance.Between(playerX, playerY, tx, ty);
        const inRange = dist <= MAX_PLANT_DISTANCE;

        let color: number;

        if (isHoe) {
            const canFarm = this.farmFields.canFarmAt(tx, ty);
            color = !canFarm ? 0xff4444 : !inRange ? 0xffcc00 : 0x44ff44;
        } else {
            const crop = this.crops.get(this.cellKey(tx, ty));
            if (!crop) {
                color = 0xff4444;
            } else if (!inRange || crop.stage !== 3) {
                color = 0xffcc00;
            } else {
                color = 0x44ff44;
            }
        }

        this.tileCursor
            .setPosition(tx, ty)
            .setStrokeStyle(2, color, 0.9)
            .setFillStyle(color, 0.15)
            .setVisible(true);
    }

    private onPointerDown(pointer: Phaser.Input.Pointer) {
        const item = this.inventory.getCurrentItem();
        if (!item) return;

        const itemId = ITEMS[item.id]?.id;
        if (itemId !== TOOL_HOE && itemId !== TOOL_SCYTHE) return;

        const worldX = pointer.worldX;
        const worldY = pointer.worldY;

        const tx = this.snap(worldX);
        const ty = this.snap(worldY);

        const playerX = (this.scene as any).player?.x ?? 0;
        const playerY = (this.scene as any).player?.y ?? 0;
        const dist = Phaser.Math.Distance.Between(playerX, playerY, tx, ty);

        if (itemId === TOOL_HOE) {
            if (!this.farmFields.canFarmAt(tx, ty)) {
                UIRoot.toast.show("Não é possível plantar aqui.", "error");
                return;
            }
            if (dist > MAX_PLANT_DISTANCE) {
                UIRoot.toast.show("Estás longe demais para plantar.", "error");
                return;
            }
            this.openSeedPicker(worldX, worldY);
        } else {
            if (!this.crops.get(this.cellKey(tx, ty))) {
                UIRoot.toast.show("Não há nenhuma planta aqui.", "error");
                return;
            }
            if (dist > MAX_PLANT_DISTANCE) {
                UIRoot.toast.show("Estás longe demais para colher.", "error");
                return;
            }
            this.tryHarvest(tx, ty);
        }
    }

    private isNight(): boolean {
        const hour = this.timeSystem.getHour();
        return hour >= 21 || hour < 6;
    }

    private cellKey(x: number, y: number): string {
        return `${this.snap(x)},${this.snap(y)}`;
    }

    private snap(v: number): number {
        return Math.floor(v / 32) * 32 + 16;
    }
}
