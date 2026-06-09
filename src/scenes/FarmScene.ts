import Phaser from "phaser";
import { Player } from "../entities/Player";
import { InventorySystem } from "../systems/InventorySystem";
import { InputManager } from "../input/inputManager";
import { CameraManager } from "../camera/CameraManager";
import { MapManager } from "../map/MapManager";
import { ITEM_IDS } from "../data/ItemDatabase";
import { EffectSystem } from "../systems/EffectsSystem";
import { FarmFieldSystem } from "../systems/FarmFieldSystem";
import { UIRoot } from "../UI/UIRoot";
import { CollisionSystem } from "../systems/CollisionSystem";
import { InteractionZoneSystem } from "../systems/InteractionZoneSystem";
import type { ShopType } from "../types/ShopTypes";
import { MusicManager } from "../sounds/MusicManager";
import { SettingsUI } from "../UI/UI_Settings";
import { SoundManager } from "../sounds/SoundsManager";
import { FarmEnvironmentFX } from "../camera/FarmEnvironmentFX";
import { changeScene } from "../utils/changeScene";
import { FarmingSystem } from "../systems/FarmingSystem";
import { RealLightSystem } from "../lights/RealLightSystem";
import { LevelSystem } from "../systems/LevelSystem";
import { t } from "../i18n";

export class FarmScene extends Phaser.Scene {
    public player!: Player;
    public bgMusic!: Phaser.Sound.BaseSound;
    private interactionZones!: InteractionZoneSystem;
    public farmFields!: FarmFieldSystem;
    private farmingSystem!: FarmingSystem;
    private environmentFX!: FarmEnvironmentFX;
    private inventory = InventorySystem.getInstance();
    private effects = EffectSystem.getInstance();
    private realLights!: RealLightSystem;
    private isChangingScene = false;

    private tooltip = document.getElementById("zone-tooltip")!;
    private tooltipVisible = false;

    constructor() {
        super("FarmScene");
    }

    create() {
        this.isChangingScene = false;

        //this.scene.lights.setAmbientColor(0x888888);
        this.cameras.main.fadeIn(500, 0, 0, 0);
        const mapManager = new MapManager(this);
        this.realLights = new RealLightSystem(this, mapManager);
        this.farmFields = new FarmFieldSystem(this, mapManager.map);
        this.farmingSystem = new FarmingSystem(this, this.farmFields);

        new InputManager(this, () => {
            this.handleInteraction();
        });

        new SettingsUI(this);

        const spawnPoint = mapManager.getSpawnPoint();

        this.player = new Player(
            this,
            spawnPoint?.x ?? 272,
            spawnPoint?.y ?? 496,
            mapManager.poleLayer,
        );

        this.interactionZones = new InteractionZoneSystem(
            this,
            this.player,
            mapManager,
        );

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) return;
            const zone = this.interactionZones.getZoneAt(pointer.worldX, pointer.worldY);
            if (zone) {
                const cx = zone.bounds.centerX;
                const cy = zone.bounds.centerY;
                if (localStorage.getItem("clickMoveEnabled") === "false") {
                    this.handleInteraction();
                } else {
                    this.player.moveTo(cx, cy, () => this.handleInteraction());
                }
            }
        });

        new CollisionSystem(this, this.player, mapManager);

        new CameraManager(this, this.player, mapManager.map);
        this.environmentFX = new FarmEnvironmentFX(this);

        MusicManager.play(this, "farmScene_music", 0.05);
        SoundManager.setScene(this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            MusicManager.stop();
        });
    }

    update(time: number, delta: number) {
        this.player.update(time);

        this.environmentFX.update(delta);

        this.interactionZones.update();

        this.realLights.update();

        const showTooltip =
            this.interactionZones.isInsideZone() ||
            this.farmingSystem.canWaterHere(this.player.x, this.player.y);

        if (this.tooltipVisible !== showTooltip) {
            this.tooltipVisible = showTooltip;
            this.tooltip.classList.toggle("hidden", !showTooltip);
        }

        this.effects.update();
        this.farmingSystem.update(time, this.player.x, this.player.y);
    }

    private fillBucket() {
        const item = this.inventory.getCurrentItem();

        if (!item) {
            UIRoot.toast.error(t("well.noItem"));
            return;
        }
        if (item.id !== ITEM_IDS.BUCKET_EMPTY) {
            UIRoot.toast.error(t("well.needBucket"));
            return;
        }

        const converted = this.inventory.convertOneCurrentItem(
            ITEM_IDS.BUCKET_WATER,
        );

        if (!converted) {
            UIRoot.toast.error(t("well.failed"));
            return;
        }

        LevelSystem.getInstance().addXp(1);
        UIRoot.toast.info("+1 XP");
    }

    private handleInteraction() {
        const zone = this.interactionZones.getCurrentZone();

        if (zone) {
            const { type, shopId, portalId } = zone;

            if ((type === "shop" || type === "sell") && shopId) {
                UIRoot.shop.open(shopId as ShopType);
                return;
            }

            if (type === "well") {
                this.fillBucket();
                return;
            }

            if (type === "storage") {
                UIRoot.storage.open();
                return;
            }

            if (type === "portal" && portalId === "boss") {
                if (!this.isChangingScene) {
                    this.isChangingScene = true;
                    changeScene(this, "BossScene");
                }
                return;
            }

            if (type === "trash") {
                this.inventory.removeItem(this.inventory.selectedSlot);
                return;
            }
        }

        // Interação no campo (plantar, regar, colher) — funciona sem zona
        this.farmingSystem.interact(this.player.x, this.player.y);
    }

}
