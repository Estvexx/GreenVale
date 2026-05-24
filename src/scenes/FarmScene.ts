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

        const map = this.make.tilemap({ key: "farm" });

        const tsGround = map.addTilesetImage("Ground", "Ground")!;
        const tsGroundDetails = map.addTilesetImage(
            "Ground Details",
            "Ground Details",
        )!;
        const tsTerraLavrada = map.addTilesetImage(
            "Terra Lavrada",
            "Terra Lavrada",
        )!;
        const tsCercas = map.addTilesetImage("Cercas", "Cercas")!;
        const tsTenda = map.addTilesetImage("Tenda", "Tenda")!;
        const tsArmazem = map.addTilesetImage(
            "Armazem_Green",
            "Armazem_Green",
        )!;
        const tsTileSet = map.addTilesetImage("TileSet", "TileSet")!;
        const tsFields = map.addTilesetImage(
            "Fields TileSet",
            "Fields TileSet",
        )!;
        const tsTendaVenda = map.addTilesetImage("Tenda Venda", "Tenda Venda")!;
        const tsTrees = map.addTilesetImage("Trees", "Trees")!;
        const tsCollider = map.addTilesetImage("Collider", "Collider")!;

        map.createLayer("Ground", [tsGround, tsFields])?.setDepth(0);
        map.createLayer("Ground Details", [
            tsGroundDetails,
            tsCercas,
            tsTileSet,
        ])?.setDepth(1);
        map.createLayer("Farmable Layer", tsTerraLavrada)?.setDepth(2);
        map.createLayer("Decoration", [
            tsTenda,
            tsTendaVenda,
            tsArmazem,
        ])?.setDepth(3);

        const trunkLayer = map.createLayer(
            "Trees",
            tsTrees,
        ) as Phaser.Tilemaps.TilemapLayer;
        const canopyLayer = map.createLayer(
            "AbovePlayer",
            tsTrees,
        ) as Phaser.Tilemaps.TilemapLayer;
        trunkLayer.setDepth(4);
        canopyLayer.setDepth(10);

        const collisionLayer = map.createLayer("Collision", tsCollider);
        collisionLayer?.setVisible(false);

        var camera = this.cameras.main;

        this.player = new Player(this, 272, 496, canopyLayer, trunkLayer);

        camera.startFollow(
            this.player, // gameObject
            true, // roundPx - evita pixels meio (bom para pixel art)
            0.05, // lerpX - suavidade horizontal (0=instantâneo, 1=rígido)
            0.05, // lerpY - basicamente o mapa mexe-se levemente com o jogador
            0, // offsetX
            0, // offsetY
        );

        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        collisionLayer?.setCollisionByExclusion([-1, 0]);
        this.physics.add.collider(this.player, collisionLayer!);

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
