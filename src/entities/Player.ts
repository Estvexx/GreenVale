import Phaser from "phaser";

const AVAILABLE_SKINS = ["skin_a", "skin_b", "skin_c", "skin_d"];

// Tile 676 é o lado esquerdo da copa, 677 é o direito (definidos no Tiled)
const TREE_CANOPY_TILES = [676, 677];

export class Player extends Phaser.Physics.Arcade.Sprite {
    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private shadow: Phaser.GameObjects.Ellipse;
    private idleTexture: string;
    private walkTexture: string;
    private walkTimer: number = 0;
    private walkFrame: number = 0;
    private canopyLayer: Phaser.Tilemaps.TilemapLayer;
    private trunkLayer: Phaser.Tilemaps.TilemapLayer;

    private static readonly WALK_FRAME_INTERVAL = 200;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        canopyLayer: Phaser.Tilemaps.TilemapLayer,
        trunkLayer: Phaser.Tilemaps.TilemapLayer,
    ) {
        const skin = Player.getSavedSkin();
        super(scene, x, y, `${skin}_idle`);

        this.idleTexture = `${skin}_idle`;
        this.walkTexture = `${skin}_walk`;
        this.canopyLayer = canopyLayer;
        this.trunkLayer = trunkLayer;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cursorKeys = scene.input.keyboard!.createCursorKeys();
        this.setScale(0.4);
        this.setDepth(6);
        this.shadow = scene.add
            .ellipse(x, y + 22, 18, 6, 0x000000, 0.4)
            .setDepth(this.depth - 1);
    }

    static getSavedSkin(): string {
        const saved = localStorage.getItem("playerSkin") ?? "skin_a";
        return AVAILABLE_SKINS.includes(saved) ? saved : "skin_a";
    }

    applySkin() {
        const skin = Player.getSavedSkin();
        this.idleTexture = `${skin}_idle`;
        this.walkTexture = `${skin}_walk`;
        this.setTexture(this.idleTexture);
    }

    update(time: number) {
        this.handleMovement();
        this.updateAnimation(time);
        this.shadow.setPosition(this.x, this.y + 22);
        this.updateTreeTransparency();
    }

    private handleMovement() {
        const speed = 200;
        this.setVelocity(0);

        if (this.cursorKeys.left.isDown) {
            this.setVelocityX(-speed);
            this.setFlipX(true);
        } else if (this.cursorKeys.right.isDown) {
            this.setVelocityX(speed);
            this.setFlipX(false);
        }

        if (this.cursorKeys.up.isDown) {
            this.setVelocityY(-speed);
        } else if (this.cursorKeys.down.isDown) {
            this.setVelocityY(speed);
        }
    }

    private updateAnimation(time: number) {
        const isMoving =
            this.body!.velocity.x !== 0 || this.body!.velocity.y !== 0;

        if (isMoving) {
            if (time > this.walkTimer) {
                this.walkFrame = this.walkFrame === 0 ? 1 : 0;
                this.setTexture(
                    this.walkFrame === 0 ? this.idleTexture : this.walkTexture,
                );
                this.walkTimer = time + Player.WALK_FRAME_INTERVAL;
            }
        } else {
            this.walkFrame = 0;
            this.setTexture(this.idleTexture);
        }
    }

    private updateTreeTransparency() {
        this.canopyLayer.forEachTile((tile) => tile.setAlpha(1));
        this.trunkLayer.forEachTile((tile) => tile.setAlpha(1));

        const canopyTile =
            this.canopyLayer.getTileAtWorldXY(this.x, this.y) ??
            this.canopyLayer.getTileAtWorldXY(this.x, this.y + 22);

        if (!canopyTile || !TREE_CANOPY_TILES.includes(canopyTile.index))
            return;

        const leftCol =
            canopyTile.index === TREE_CANOPY_TILES[0]
                ? canopyTile.x
                : canopyTile.x - 1;

        for (const col of [leftCol, leftCol + 1]) {
            this.canopyLayer.getTileAt(col, canopyTile.y)?.setAlpha(0.4);
            this.trunkLayer.getTileAt(col, canopyTile.y + 1)?.setAlpha(0.4);
        }
    }
}
