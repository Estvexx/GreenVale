import Phaser from "phaser";
import { Player } from "../entities/Player";
import { InventorySystem } from "../systems/InventorySystem";
import { SettingsUI } from "../UI/UI_Settings";
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

export class FarmScene extends Phaser.Scene {
    public player!: Player;
    public bgMusic!: Phaser.Sound.BaseSound;
    private interactionZones!: InteractionZoneSystem;
    private farmFields!: FarmFieldSystem;

    private inventory = InventorySystem.getInstance();
    private effects = EffectSystem.getInstance();

    private tooltip = document.getElementById("zone-tooltip")!;

    constructor() {
        super("FarmScene");
    }

    create() {
        const mapManager = new MapManager(this);
        this.farmFields = new FarmFieldSystem(this, mapManager.map);

        new InputManager(this, () => {
            this.handleInteraction();
        });

        const settingsUI = new SettingsUI(this);

        const spawnPoint = mapManager.getSpawnPoint();

        this.player = new Player(
            this,
            spawnPoint?.x ?? 272,
            spawnPoint?.y ?? 496,
        );

        this.interactionZones = new InteractionZoneSystem(
            this,
            this.player,
            mapManager,
        );

        new CollisionSystem(this, this.player, mapManager);

        new CameraManager(this, this.player, mapManager.map);

        this.bgMusic = this.sound.add("bgMusic", {
            loop: true,
            volume: 0.1,
        });

        settingsUI.initMusic();

        this.inventory.addStartingItems();
    }

    update(time: number) {
        this.player.update(time);

        this.interactionZones.update();

        this.tooltip.classList.toggle(
            "hidden",
            !this.interactionZones.isInsideZone(),
        );

        this.effects.update();
    }

    private fillBucket() {
        const item = this.inventory.getCurrentItem();

        if (!item) return;
        if (item.id !== ITEM_IDS.BUCKET_EMPTY) return;

        const converted = this.inventory.convertOneCurrentItem(
            ITEM_IDS.BUCKET_WATER,
        );

        if (!converted) {
            console.log("Não foi possível encher o balde.");
        }
    }

    private handleInteraction() {
        const zone = this.interactionZones.getCurrentZone();

        if (!zone) return;

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
            this.scene.start("BossScene");
            return;
        }

        if (type === "trash") {
            this.inventory.removeItem(this.inventory.selectedSlot);
        }
    }
}
