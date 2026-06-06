import Phaser from "phaser";
import { InventorySystem } from "./InventorySystem";
import { FarmFieldSystem } from "./FarmFieldSystem";
import { ITEMS } from "../data/ItemDatabase";
import { LevelSystem } from "./LevelSystem";
import { TimeSystem } from "./TimeSystem";
import { UIRoot } from "../UI/UIRoot";

const TOOL_SCYTHE       = 2;
const TOOL_BUCKET_WATER = 4;
const TOOL_HOE          = 1;

// À noite as plantas crescem 3x mais devagar
const NIGHT_GROW_MULTIPLIER = 3;

type PlantedCrop = {
    sprite: Phaser.GameObjects.Image;
    icon: Phaser.GameObjects.Image;
    seedId: number;
    stage: number;
    watered: boolean;
    lastGrowTime: number;
};

export class FarmingSystem {
    private scene: Phaser.Scene;
    private farmFields: FarmFieldSystem;
    private inventory = InventorySystem.getInstance();
    private levelSystem = LevelSystem.getInstance();
    private timeSystem = TimeSystem.getInstance();

    private crops = new Map<string, PlantedCrop>();
    private pendingPlantX = 0;
    private pendingPlantY = 0;

    constructor(scene: Phaser.Scene, farmFields: FarmFieldSystem) {
        this.scene = scene;
        this.farmFields = farmFields;
    }

    interact(playerX: number, playerY: number) {
        const item = this.inventory.getCurrentItem();
        if (!item) return;

        const itemData = ITEMS[item.id];
        if (!itemData) return;

        if (itemData.id === TOOL_HOE)           this.openSeedPicker(playerX, playerY);
        if (itemData.isSeed)                    this.tryPlant(playerX, playerY, item.id);
        if (itemData.id === TOOL_BUCKET_WATER)  this.tryWater(playerX, playerY);
        if (itemData.id === TOOL_SCYTHE)        this.tryHarvest(playerX, playerY);
    }

    update(time: number) {
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

        const icon = this.createIcon(cx, cy, "icon_water");

        this.crops.set(key, {
            sprite,
            icon,
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
        this.inventory.removeItemById(TOOL_BUCKET_WATER, 1);
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
        } else if (!crop.watered) {
            crop.icon.setTexture("icon_water").setVisible(true);
        } else {
            crop.icon.setVisible(false);
        }
    }

    private createIcon(x: number, y: number, texture: string): Phaser.GameObjects.Image {
        return this.scene.add.image(x, y - 28, texture)
            .setDepth(20)
            .setScale(0.5);
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
