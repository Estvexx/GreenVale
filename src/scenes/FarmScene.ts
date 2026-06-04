import Phaser from "phaser";
import { Player } from "../entities/Player";
import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";
import { SettingsUI } from "../UI/UI_Settings";
import { UI_ShopManager } from "../UI/UI_ShopManager";
import { UI_StorageManager } from "../UI/UI_StorageManager";
import { UI_HotBar } from "../UI/UI_Hotbar";
import { UI_Inventory } from "../UI/UI_Inventory";
import { UIInventoryManager } from "../UI/UI_InventoryManager";
import { InputManager } from "../input/inputManager";
import { CameraManager } from "../camera/CameraManager";
import { MapManager } from "../map/MapManager";
import { UIMoneyManager } from "../UI/UI_MoneyManager";
import { preloadUIImages } from "../utils/preloadUIImages";
import { ITEM_IDS } from "../data/ItemDatabase";
import { UI_EffectShopManager } from "../UI/UI_EffectShopManager";
import { UI_ActiveEffectsManager } from "../UI/UI_ActiveEffectsManager";
import { EffectSystem } from "../systems/EffectsSystem";

export class FarmScene extends Phaser.Scene {
    public player!: Player;
    public bgMusic!: Phaser.Sound.BaseSound;

    private shopManager!: UI_ShopManager;
    private storageManager!: UI_StorageManager;
    private radialMenu!: UI_EffectShopManager;
    private effects = EffectSystem.getInstance();

    inventory = InventorySystem.getInstance();

    private currentZone: {
        type: string;
        shopId?: string;
        portalId?: string;
    } | null = null;
    private isInZone = false;
    private tooltip = document.getElementById("zone-tooltip")!;

    constructor() {
        super("FarmScene");
    }

    create() {
        preloadUIImages();

        const mapManager = new MapManager(this);

        InventorySystem.getInstance().addStartingItems();
        MoneySystem.getInstance();

        new InputManager(this);
        new UI_HotBar();
        new UI_Inventory();
        new UIInventoryManager();
        new UIMoneyManager();
        this.radialMenu = new UI_EffectShopManager();
        new UI_ActiveEffectsManager();

        this.shopManager = new UI_ShopManager();
        this.storageManager = new UI_StorageManager();
        const settingsUI = new SettingsUI(this);

        InventorySystem.getInstance().addStartingItems();
        MoneySystem.getInstance();

        const spawnPoint = mapManager.getSpawnPoint();

        this.player = new Player(
            this,
            spawnPoint?.x ?? 272,
            spawnPoint?.y ?? 496,
        );

        new CameraManager(this, this.player, mapManager.map);

        this.bgMusic = this.sound.add("bgMusic", {
            loop: true,
            volume: 0.1,
        });

        settingsUI.initMusic();

        mapManager.getCollisionObjects().forEach((obj) => {
            const rect = this.add.rectangle(
                obj.x! + obj.width! / 2,
                obj.y! + obj.height! / 2,
                obj.width!,
                obj.height!,
            );

            this.physics.add.existing(rect, true);
            this.physics.add.collider(this.player, rect);
        });

        mapManager.getInteractables().forEach((obj) => {
            const zone = this.add.zone(
                obj.x! + obj.width! / 2,
                obj.y! + obj.height! / 2,
                obj.width!,
                obj.height!,
            );
            this.physics.add.existing(zone, true);

            const type = obj.properties?.find(
                (p: any) => p.name === "type",
            )?.value;
            const shopId = obj.properties?.find(
                (p: any) => p.name === "shopId",
            )?.value;
            const portalId = obj.properties?.find(
                (p: any) => p.name === "portalId",
            )?.value;

            this.physics.add.overlap(this.player, zone, () => {
                this.currentZone = { type, shopId, portalId };
                this.isInZone = true;
            });
        });

        this.input.keyboard?.on("keydown-F", () => {
            if (!this.currentZone) return;

            const { type, shopId, portalId } = this.currentZone;
            if (type === "shop") this.shopManager.open(shopId);
            if (type === "sell") this.shopManager.open(shopId);
            if (type === "well") {
                console.log("Zona", this.currentZone);
                this.fillBucket();
            }
            if (type === "storage") {
                console.log("Abrir armazém");
                this.storageManager.open();
            }
            if (type === "portal" && portalId === "boss") {
                this.scene.start("BossScene");
            }
        });

        this.input.keyboard?.on("keydown-Q", () => {
            this.radialMenu.toggle();
        });

        this.inventory.onSelectionChange(() => {
            this.updateHeldItem();
        });

        this.updateHeldItem();
    }

    updateHeldItem() {
        this.inventory.getCurrentItem();
        //const item = this.inventory.getCurrentItem();
        //console.log("Item na mão agora:", item);
    }

    update(time: number) {
        this.player.update(time);

        this.tooltip.classList.toggle("hidden", !this.isInZone);

        if (!this.isInZone) {
            this.currentZone = null;
        }

        this.isInZone = false;
        this.effects.update();
    }

    private fillBucket() {
        console.log("Chamei a funçao");
        const item = this.inventory.getCurrentItem();

        if (!item) return;

        if (item.id !== ITEM_IDS.BUCKET_EMPTY) return;
        console.log("Ola boi");
        this.inventory.convertOneCurrentItem(ITEM_IDS.BUCKET_WATER);
        console.log("Balde cheio!");
    }
}
