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

export class FarmScene extends Phaser.Scene {
    public player!: Player;
    public bgMusic!: Phaser.Sound.BaseSound;
    private shopManager!: ShopManager;
    inventory = InventorySystem.getInstance();

    constructor() {
        super("FarmScene");
    }

    create() {
        const map = this.make.tilemap({ key: "mapa" });

        new InputManager(this);
        new UI_HotBar();
        new UI_Inventory();
        new UIInventoryManager();
        new CameraManager(this, this.player, map);
        this.shopManager = new ShopManager(this);
        const settingsUI = new SettingsUI(this);

        InventorySystem.getInstance().addStartingItems();
        MoneySystem.getInstance();

        //this.scene.launch("hud-ui");

        this.bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.1 });
        settingsUI.initMusic();

        this.inventory.onSelectionChange(() => {
            this.updateHeldItem();
        });

        this.updateHeldItem();

        const tsGround = map.addTilesetImage("TileSet_Ground", "chao")!;
        map.createLayer("Ground", tsGround)?.setDepth(0);

        const tsFarmable = map.addTilesetImage("Terras_Aradas", "terras")!;
        map.createLayer("Farmable Layer", tsFarmable)?.setDepth(1);

        const tsFence = map.addTilesetImage("Fence", "cercas")!;
        const tsBoat = map.addTilesetImage("boat", "barcos")!;
        const tsRocks = map.addTilesetImage("Rocks", "rochas")!;
        const tsPlantsandWell = map.addTilesetImage(
            "Plantacao_Poco",
            "arvores_e_poco",
        )!;

        map.createLayer("Decoration", [
            tsFence,
            tsBoat,
            tsRocks,
            tsPlantsandWell,
        ])?.setDepth(2);

        map.createLayer("Trees", tsPlantsandWell)?.setDepth(3);
        map.createLayer("Trees2", tsPlantsandWell)?.setDepth(4);
        map.createLayer("Trees3", tsPlantsandWell)?.setDepth(5);

        const tsBuildings = map.addTilesetImage("Shops", "lojas")!;
        map.createLayer("Buildings", [tsBuildings, tsPlantsandWell])?.setDepth(
            3,
        );

        const spawnPoint = map.getObjectLayer("SpawnPoint")?.objects[0];
        this.player = new Player(
            this,
            spawnPoint?.x ?? 272,
            spawnPoint?.y ?? 496,
        );

        const collisionLayer = map.getObjectLayer("Collision");
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
