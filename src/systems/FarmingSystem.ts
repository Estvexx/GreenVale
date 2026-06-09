import Phaser from "phaser";
import { InventorySystem } from "./InventorySystem";
import { FarmFieldSystem } from "./FarmFieldSystem";
import { ITEMS } from "../data/ItemDatabase";
import { LevelSystem } from "./LevelSystem";
import { TimeSystem } from "./TimeSystem";
import { UIRoot } from "../UI/UIRoot";
import { t } from "../i18n";

const HOE          = 1;
const SCYTHE       = 2;
const BUCKET_EMPTY = 3;
const BUCKET_WATER = 4;

const TILE_SIZE        = 32;
const REACH            = 80;
const NIGHT_SLOW       = 3;
const HARVEST_STAGE    = 3;
const POST_HARVEST     = 2;

type Crop = {
    sprite:     Phaser.GameObjects.Image;
    bubble:     Phaser.GameObjects.Arc;
    icon:       Phaser.GameObjects.Image;
    seedId:     number;
    stage:      number;
    watered:    boolean;
    grownAt:    number;
};

export class FarmingSystem {
    private scene:      Phaser.Scene;
    private fields:     FarmFieldSystem;
    private inventory   = InventorySystem.getInstance();
    private levels      = LevelSystem.getInstance();
    private clock       = TimeSystem.getInstance();

    private crops       = new Map<string, Crop>();
    private cursor:     Phaser.GameObjects.Rectangle;

    private plantX = 0;
    private plantY = 0;

    constructor(scene: Phaser.Scene, fields: FarmFieldSystem) {
        this.scene  = scene;
        this.fields = fields;

        this.cursor = scene.add
            .rectangle(0, 0, TILE_SIZE, TILE_SIZE)
            .setDepth(15)
            .setVisible(false);

        scene.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.onClick(p));
    }

    update(time: number, playerX: number, playerY: number) {
        this.updateCursor(playerX, playerY);
        this.growCrops(time);
    }

    interact(playerX: number, playerY: number) {
        const item = this.inventory.getCurrentItem();
        if (!item) return;

        const tool = ITEMS[item.id]?.id;
        if (tool === HOE)          this.startPlanting(playerX, playerY);
        if (tool === BUCKET_WATER) this.water(playerX, playerY);
        if (tool === SCYTHE)       this.harvest(playerX, playerY);
    }

    canWaterHere(playerX: number, playerY: number): boolean {
        const item = this.inventory.getCurrentItem();
        if (ITEMS[item?.id ?? 0]?.id !== BUCKET_WATER) return false;
        const crop = this.crops.get(this.key(playerX, playerY));
        return !!crop && !crop.watered;
    }

    private growCrops(time: number) {
        const slowdown = this.isNight() ? NIGHT_SLOW : 1;

        for (const crop of this.crops.values()) {
            if (!crop.watered || crop.stage === HARVEST_STAGE) continue;

            const base = ITEMS[crop.seedId]?.growTime;
            if (!base) continue;

            if (time - crop.grownAt >= base * slowdown) {
                crop.stage++;
                crop.watered  = false;
                crop.grownAt  = time;
                this.refreshSprite(crop);
                this.refreshIcon(crop);
            }
        }
    }

    private startPlanting(x: number, y: number) {
        if (!this.fields.canFarmAt(x, y)) {
            const lvl = this.fields.getRequiredLevelAt(x, y);
            if (lvl) UIRoot.toast.show(t("farming.levelRequired").replace("{level}", String(lvl)), "error");
            return;
        }

        if (this.crops.has(this.key(x, y))) {
            this.uproot(x, y);
            return;
        }

        this.plantX = x;
        this.plantY = y;

        const ok = UIRoot.seedPicker.open((seedId) => {
            this.plant(this.plantX, this.plantY, seedId);
        });

        if (!ok) UIRoot.toast.show(t("farming.noSeeds"), "error");
    }

    private plant(x: number, y: number, seedId: number) {
        if (!this.fields.canFarmAt(x, y)) return;
        if (this.crops.has(this.key(x, y))) return;

        const data = ITEMS[seedId];
        if (!data?.cropKey) return;
        if (this.inventory.getItemQuantity(seedId) <= 0) return;

        const cx = this.snap(x);
        const cy = this.snap(y);

        const sprite = this.scene.add.image(cx, cy, `crop_${data.cropKey}_0`).setDepth(8);
        const { bubble, icon } = this.makeIcon(cx, cy, "icon_water");

        this.crops.set(this.key(x, y), {
            sprite, bubble, icon,
            seedId,
            stage:   0,
            watered: false,
            grownAt: this.scene.time.now,
        });

        this.inventory.removeItemById(seedId, 1);
        this.levels.addXp(2);
        UIRoot.toast.info("+2 XP");
    }

    private water(x: number, y: number) {
        const crop = this.crops.get(this.key(x, y));
        if (!crop || crop.watered) return;

        crop.watered = true;
        crop.grownAt = this.scene.time.now;
        this.hideIcon(crop);

        this.inventory.removeItemById(BUCKET_WATER, 1);
        this.inventory.addItem(BUCKET_EMPTY, 1);
        this.levels.addXp(2);
        UIRoot.toast.info("+2 XP");
    }

    private harvest(x: number, y: number) {
        const crop = this.crops.get(this.key(x, y));
        if (!crop) return;

        if (crop.stage !== HARVEST_STAGE) {
            UIRoot.toast.show(t("farming.notReady"), "error");
            return;
        }

        const drop = ITEMS[crop.seedId]?.harvestId;
        if (drop) {
            this.inventory.addItem(drop, 1);
            this.levels.addXp(2);
            UIRoot.toast.info("+2 XP");
        }

        crop.stage   = POST_HARVEST;
        crop.watered = false;
        this.refreshSprite(crop);
        this.refreshIcon(crop);
    }

    private uproot(x: number, y: number) {
        const crop = this.crops.get(this.key(x, y));
        if (!crop) return;

        crop.sprite.destroy();
        crop.bubble.destroy();
        crop.icon.destroy();
        this.crops.delete(this.key(x, y));
    }

    private refreshSprite(crop: Crop) {
        const key = ITEMS[crop.seedId]?.cropKey;
        if (key) crop.sprite.setTexture(`crop_${key}_${crop.stage}`);
    }

    private refreshIcon(crop: Crop) {
        if (crop.stage === HARVEST_STAGE) {
            crop.icon.setTexture("icon_scythe");
            this.showIcon(crop);
        } else if (!crop.watered) {
            crop.icon.setTexture("icon_water");
            this.showIcon(crop);
        } else {
            this.hideIcon(crop);
        }
    }

    private showIcon(crop: Crop) {
        crop.icon.setVisible(true);
        crop.bubble.setVisible(true);
    }

    private hideIcon(crop: Crop) {
        crop.icon.setVisible(false);
        crop.bubble.setVisible(false);
    }

    private makeIcon(x: number, y: number, texture: string) {
        const bubble = this.scene.add.circle(x, y - 28, 12, 0xffffff).setDepth(19);
        const icon   = this.scene.add.image(x, y - 28, texture).setDepth(20).setScale(0.5);
        return { bubble, icon };
    }

    private updateCursor(playerX: number, playerY: number) {
        const item   = this.inventory.getCurrentItem();
        const toolId = item ? ITEMS[item.id]?.id : null;

        if (toolId !== HOE && toolId !== SCYTHE) {
            this.cursor.setVisible(false);
            return;
        }

        const p  = this.scene.input.activePointer;
        const tx = this.snap(p.worldX);
        const ty = this.snap(p.worldY);

        const dist    = Phaser.Math.Distance.Between(playerX, playerY, tx, ty);
        const inReach = dist <= REACH;

        let color: number;

        if (toolId === HOE) {
            const ok = this.fields.canFarmAt(tx, ty);
            color = !ok ? 0xff4444 : !inReach ? 0xffcc00 : 0x44ff44;
        } else {
            const crop = this.crops.get(this.key(tx, ty));
            color = !crop ? 0xff4444 : (!inReach || crop.stage !== HARVEST_STAGE) ? 0xffcc00 : 0x44ff44;
        }

        this.cursor.setPosition(tx, ty).setStrokeStyle(2, color, 0.9).setFillStyle(color, 0.15).setVisible(true);
    }

    private onClick(pointer: Phaser.Input.Pointer) {
        const item   = this.inventory.getCurrentItem();
        const toolId = item ? ITEMS[item.id]?.id : null;
        if (toolId !== HOE && toolId !== SCYTHE) return;

        const tx = this.snap(pointer.worldX);
        const ty = this.snap(pointer.worldY);

        const player = (this.scene as any).player;
        const dist   = Phaser.Math.Distance.Between(player?.x ?? 0, player?.y ?? 0, tx, ty);

        if (toolId === HOE) {
            if (!this.fields.canFarmAt(tx, ty)) {
                UIRoot.toast.show(t("farming.cantPlantHere"), "error");
                return;
            }
            if (dist > REACH) {
                UIRoot.toast.show(t("farming.tooFarToPlant"), "error");
                return;
            }
            this.startPlanting(pointer.worldX, pointer.worldY);
        } else {
            if (!this.crops.get(this.key(tx, ty))) {
                UIRoot.toast.show(t("farming.noPlantHere"), "error");
                return;
            }
            if (dist > REACH) {
                UIRoot.toast.show(t("farming.tooFarToHarvest"), "error");
                return;
            }
            this.harvest(tx, ty);
        }
    }

    private isNight() {
        const h = this.clock.getHour();
        return h >= 21 || h < 6;
    }

    private key(x: number, y: number) {
        return `${this.snap(x)},${this.snap(y)}`;
    }

    private snap(v: number) {
        return Math.floor(v / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
    }
}
