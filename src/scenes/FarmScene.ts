import Phaser from "phaser";
import { Player } from "../entities/Player";
import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";
import { ShopManager } from "../shops/ShopManager";
import { SettingsUI } from "../UI/SettingsUI";
import { UI_HotBar } from "../UI/UI_Hotbar";
import { UI_Inventory } from "../UI/UI_Inventory";
import { UIInventoryManager } from "../UI/UI_InventoryManager";
import { InputManager } from "../input/inputManager";
import { CameraManager } from "../camera/CameraManager";
import { MapManager } from "../map/MapManager";

export class FarmScene extends Phaser.Scene {
    public player!: Player;
    public bgMusic!: Phaser.Sound.BaseSound;
    private shopManager!: ShopManager;
    inventory = InventorySystem.getInstance();

    constructor() {
        super("FarmScene");
    }

    create() {
        const mapManager = new MapManager(this);
        new InputManager(this);
        new UI_HotBar();
        new UI_Inventory();
        new UIInventoryManager();

        this.shopManager = new ShopManager(this);
        const settingsUI = new SettingsUI(this);

        InventorySystem.getInstance().addStartingItems();
        MoneySystem.getInstance();

        //this.scene.launch("hud-ui");

        const spawnPoint =
            mapManager.map.getObjectLayer("SpawnPoint")?.objects[0];

        this.player = new Player(
            this,
            spawnPoint?.x ?? 272,
            spawnPoint?.y ?? 496,
        );

        new CameraManager(this, this.player, mapManager.map);

        this.bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.1 });
        settingsUI.initMusic();

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

        this.inventory.onSelectionChange(() => {
            this.updateHeldItem();
        });

        this.updateHeldItem();
    }

    updateHeldItem() {
        const item = this.inventory.getCurrentItem();

        console.log("Item na mão agora:", item);
    }

    update(time: number) {
        this.player.update(time);
        this.shopManager.update(this.player.x, this.player.y);
    }
}
