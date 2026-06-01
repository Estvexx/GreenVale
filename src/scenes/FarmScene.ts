import Phaser from "phaser";
import { Player } from "../entities/Player";
import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";
import { UI_ShopManager } from "../UI/UI_ShopManager";
import { SettingsUI } from "../UI/UI_Settings";
import { UI_HotBar } from "../UI/UI_Hotbar";
import { UI_Inventory } from "../UI/UI_Inventory";
import { UIInventoryManager } from "../UI/UI_InventoryManager";
import { InputManager } from "../input/inputManager";
import { CameraManager } from "../camera/CameraManager";
import { MapManager } from "../map/MapManager";
import { UIMoneyManager } from "../UI/UI_MoneyManager";
import { preloadUIImages } from "../utils/preloadUIImages";

export class FarmScene extends Phaser.Scene {
    public player!: Player;
    public bgMusic!: Phaser.Sound.BaseSound;

    private shopManager!: UI_ShopManager;

    inventory = InventorySystem.getInstance();

    private currentZone: { type: string; shopId: string } | null = null;
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

        this.shopManager = new UI_ShopManager();
        const settingsUI = new SettingsUI(this);

        InventorySystem.getInstance().addStartingItems();
        MoneySystem.getInstance();

        const spawnPoint =
            mapManager.map.getObjectLayer("SpawnPoint")?.objects[0];

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

        // -----------------------------
        // COLLISIONS
        // -----------------------------
        const collisionLayer = mapManager.map.getObjectLayer("Collision");

        collisionLayer?.objects.forEach((obj) => {
            const rect = this.add.rectangle(
                obj.x! + obj.width! / 2,
                obj.y! + obj.height! / 2,
                obj.width!,
                obj.height!,
            );

            this.physics.add.existing(rect, true);
            this.physics.add.collider(this.player, rect);
        });

        // -----------------------------
        // INTERACTABLE ZONES
        // -----------------------------
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

            this.physics.add.overlap(this.player, zone, () => {
                this.currentZone = { type, shopId };
                this.isInZone = true;
            });
        });

        this.input.keyboard?.on("keydown-F", () => {
            if (!this.currentZone) return;

            const { type, shopId } = this.currentZone;
            if (type === "shop") this.shopManager.open(shopId);
            if (type === "sell") console.log("Abrir venda");
            if (type === "well") console.log("Encher água");
            if (type === "storage") console.log("Abrir armazém");
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
    }
}
