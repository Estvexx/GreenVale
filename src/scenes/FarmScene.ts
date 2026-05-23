import Phaser from "phaser";
import { Player } from "../entities/Player";

const SKINS = ["skin_a", "skin_b", "skin_c", "skin_d"];

export class FarmScene extends Phaser.Scene {
    public player!: Player;
    public bgMusic!: Phaser.Sound.BaseSound;

    constructor() {
        super("FarmScene");
    }

    preload() {
        for (const skin of SKINS) {
            this.load.image(
                `${skin}_idle`,
                `assets/images/players/player_walk2_${skin}.png`,
            );
            this.load.image(
                `${skin}_walk`,
                `assets/images/players/player_walk1_${skin}.png`,
            );
        }

        this.load.tilemapTiledJSON("farm", "assets/maps/mapa_final.tmj");
        this.load.image(
            "Armazem_Green",
            "assets/images/map_images/Supplies.png",
        );
        this.load.image("Cercas", "assets/images/map_images/fence_alt.png");
        this.load.image("Collider", "assets/images/map_images/collider.png");
        this.load.image(
            "Fields TileSet",
            "assets/images/map_images/FieldsTileset.png",
        );
        this.load.image("Ground", "assets/images/map_images/TileSet_V1.png");
        this.load.image(
            "Ground Details",
            "assets/images/map_images/TX Props.png",
        );
        this.load.image("Tenda", "assets/images/map_images/1.png");
        this.load.image("Tenda Venda", "assets/images/map_images/4.png");
        this.load.image(
            "Terra Lavrada",
            "assets/images/map_images/terrain.png",
        );
        this.load.image("TileSet", "assets/images/map_images/Tileset2.png");
        this.load.image("Trees", "assets/images/map_images/spr_tree_9.png");

        this.load.audio("bgMusic", "assets/audio/apple_cider.ogg");
    }

    create() {
        this.add.text(10, 10, "GreenVale", {
            fontSize: "64px",
            color: "#ffffff",
            backgroundColor: "#b6b6b6",
        });

        this.scene.launch("hud-ui");

        var camera = this.cameras.main;

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

        this.scene.launch("SettingsScene");

        this.bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.1 });
        this.bgMusic.play();
    }

    update(time: number) {
        this.player.update(time);
    }
}
