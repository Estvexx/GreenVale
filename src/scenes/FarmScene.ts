import Phaser from "phaser";
import { Player } from "../entities/Player";

export class FarmScene extends Phaser.Scene {
    private player!: Player;

    constructor() {
        super("FarmScene");
    }

    preload() {
        this.load.image("player", "assets/images/player_walk1.png");

        // MAPA
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
    }

    create() {
        this.add.text(10, 10, "GreenVale", {
            fontSize: "64px",
            color: "#ffffff",
            backgroundColor: "#b6b6b6",
        });
        this.scene.launch("hud-ui");

        const map = this.make.tilemap({
            key: "farm",
        });

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

        map.createLayer("Ground", [tsGround, tsFields]);
        map.createLayer("Ground Details", [
            tsGroundDetails,
            tsCercas,
            tsTileSet,
        ]);
        map.createLayer("Farmable Layer", tsTerraLavrada);
        map.createLayer("Decoration", [tsTenda, tsTendaVenda, tsArmazem]);
        map.createLayer("Trees", tsTrees);

        const collisionLayer = map.createLayer("Collision", tsCollider);
        collisionLayer?.setVisible(false);

        const abovePlayer = map.createLayer("AbovePlayer", tsTrees);
        abovePlayer?.setDepth(10);

        this.player = new Player(this, 400, 300);

        collisionLayer?.setCollisionByExclusion([-1, 0]);
        this.physics.add.collider(this.player, collisionLayer!);

        this.scene.launch("SettingsScene");
    }

    update() {
        this.player.update();
    }
}
