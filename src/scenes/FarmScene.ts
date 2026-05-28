import Phaser from "phaser";
import { Player } from "../entities/Player";
import { InventorySystem } from "../systems/InventorySystem";
import { MoneySystem } from "../systems/MoneySystem";
import { ShopManager } from "../shops/ShopManager";

export class FarmScene extends Phaser.Scene {
    public player!: Player;
    public bgMusic!: Phaser.Sound.BaseSound;
    private shopManager!: ShopManager;

    constructor() {
        super("FarmScene");
    }

    create() {
        this.shopManager = new ShopManager(this);
        this.scene.launch("HotbarScene");
        this.scene.launch("hud-ui");
        this.scene.launch("SettingsScene");

        InventorySystem.getInstance().addStartingItems();
        MoneySystem.getInstance();

        const map = this.make.tilemap({ key: "mapa" });
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

        //const collisionLayer = map.createLayer("Collision", tsCollider);
        //collisionLayer?.setVisible(false);

        var camera = this.cameras.main;

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

        camera.startFollow(
            this.player, // gameObject
            true, // roundPx - evita pixels meio (bom para pixel art)
            0.05, // lerpX - suavidade horizontal (0=instantâneo, 1=rígido)
            0.05, // lerpY - basicamente o mapa mexe-se levemente com o jogador
            0, // offsetX
            0, // offsetY
        );

        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //collisionLayer?.setCollisionByExclusion([-1, 0]);
        //this.physics.add.collider(this.player, collisionLayer!);

        this.bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.1 });
        this.bgMusic.play();
    }

    update(time: number) {
        this.player.update(time);
        this.shopManager.update(this.player.x, this.player.y);
        /* console.log(
            `Player: x=${Math.floor(this.player.x)}, y=${Math.floor(this.player.y)}`,
        ); */
    }
}
