import Phaser from "phaser";
import { EffectSystem } from "../systems/EffectsSystem";

const AVAILABLE_SKINS = ["skin_a", "skin_b", "skin_c", "skin_d"];

export class Player extends Phaser.Physics.Arcade.Sprite {
    private effects = EffectSystem.getInstance();
    private footstepSound: Phaser.Sound.BaseSound;
    private static readonly BASE_SPEED = 200;

    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasdKeys!: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };
    public controlScheme: string =
        localStorage.getItem("controlScheme") || "wasd";

    private shadow: Phaser.GameObjects.Ellipse;
    private idleTexture: string;
    private walkTexture: string;
    private walkTimer: number = 0;
    private walkFrame: number = 0;

    private static readonly WALK_FRAME_INTERVAL = 200;

    private poleLayer: Phaser.Tilemaps.TilemapLayer | null = null;
    private clickTarget: { x: number; y: number; onArrive?: () => void } | null = null;
    private static readonly CLICK_ARRIVE_THRESHOLD = 6;

    constructor(scene: Phaser.Scene, x: number, y: number, poleLayer: Phaser.Tilemaps.TilemapLayer | null = null) {
        const skin = Player.getSavedSkin();
        super(scene, x, y, `${skin}_idle`);

        this.idleTexture = `${skin}_idle`;
        this.walkTexture = `${skin}_walk`;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cursorKeys = scene.input.keyboard!.createCursorKeys();
        this.wasdKeys = {
            W: scene.input.keyboard!.addKey("W"),
            A: scene.input.keyboard!.addKey("A"),
            S: scene.input.keyboard!.addKey("S"),
            D: scene.input.keyboard!.addKey("D"),
        };

        this.setScale(0.4);
        this.setDepth(10);
        this.shadow = scene.add
            .ellipse(x, y + 22, 18, 6, 0x000000, 0.4)
            .setDepth(this.depth - 1);

        this.body!.setSize(40, 16); // TAMANHO DA HITbx
        this.body!.setOffset(20, 100); // Posiçao da mesma

        this.footstepSound = scene.sound.add("setpdirt_sound", {
            loop: true,
            volume: 0.25,
        });

        this.poleLayer = poleLayer;

        scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) return;
            if (localStorage.getItem("clickMoveEnabled") === "false") return;
            this.clickTarget = { x: pointer.worldX, y: pointer.worldY };
        });

        scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (!pointer.isDown || pointer.rightButtonDown()) return;
            if (localStorage.getItem("clickMoveEnabled") === "false") return;
            if (this.clickTarget && !this.clickTarget.onArrive) {
                this.clickTarget.x = pointer.worldX;
                this.clickTarget.y = pointer.worldY;
            }
        });

        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.footstepSound.stop();
            this.footstepSound.destroy();
        });
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
        this.updateFootstepSound();
        this.updatePoleTransparency();
    }

    private handleMovement() {
        const speed = Player.BASE_SPEED * this.effects.getSpeedMultiplier();
        const usingKeys = this.isAnyKeyDown();

        this.setVelocity(0);

        if (usingKeys) {
            this.clickTarget = null;

            if (this.controlScheme === "wasd") {
                if (this.wasdKeys.A.isDown) this.setVelocityX(-speed);
                if (this.wasdKeys.D.isDown) this.setVelocityX(speed);
                if (this.wasdKeys.W.isDown) this.setVelocityY(-speed);
                if (this.wasdKeys.S.isDown) this.setVelocityY(speed);
            } else {
                if (this.cursorKeys.left.isDown) this.setVelocityX(-speed);
                if (this.cursorKeys.right.isDown) this.setVelocityX(speed);
                if (this.cursorKeys.up.isDown) this.setVelocityY(-speed);
                if (this.cursorKeys.down.isDown) this.setVelocityY(speed);
            }
        } else if (this.clickTarget) {
            const dx = this.clickTarget.x - this.x;
            const dy = this.clickTarget.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < Player.CLICK_ARRIVE_THRESHOLD) {
                const cb = this.clickTarget.onArrive;
                this.clickTarget = null;
                cb?.();
            } else {
                this.setVelocityX((dx / dist) * speed);
                this.setVelocityY((dy / dist) * speed);
            }
        }
    }

    cancelClickMove() {
        this.clickTarget = null;
    }

    moveTo(x: number, y: number, onArrive?: () => void) {
        this.clickTarget = { x, y, onArrive };
    }

    private isAnyKeyDown(): boolean {
        if (this.controlScheme === "wasd") {
            return this.wasdKeys.W.isDown || this.wasdKeys.A.isDown ||
                   this.wasdKeys.S.isDown || this.wasdKeys.D.isDown;
        }
        return this.cursorKeys.left.isDown || this.cursorKeys.right.isDown ||
               this.cursorKeys.up.isDown || this.cursorKeys.down.isDown;
    }

    private updatePoleTransparency() {
        if (!this.poleLayer) return;

        // reset todos os tiles
        this.poleLayer.forEachTile(t => t.setAlpha(1));

        // tile na posição do player ou um tile acima (para apanhar o topo do poste)
        const tile = this.poleLayer.getTileAtWorldXY(this.x, this.y)
                  ?? this.poleLayer.getTileAtWorldXY(this.x, this.y - 32);

        if (!tile) return;

        // faz fade neste tile e no de cima (poste tem 2 tiles de altura)
        tile.setAlpha(0.4);
        this.poleLayer.getTileAt(tile.x, tile.y - 1)?.setAlpha(0.4);
        this.poleLayer.getTileAt(tile.x, tile.y + 1)?.setAlpha(0.4);
    }

    private isMoving() {
        return this.body!.velocity.x !== 0 || this.body!.velocity.y !== 0;
    }

    private updateAnimation(time: number) {
        const vx = this.body!.velocity.x;
        if (vx > 0) this.setFlipX(false);
        else if (vx < 0) this.setFlipX(true);

        if (this.isMoving()) {
            if (time > this.walkTimer) {
                this.walkFrame = this.walkFrame === 0 ? 1 : 0;
                this.setTexture(this.walkFrame === 0 ? this.idleTexture : this.walkTexture);
                this.walkTimer = time + Player.WALK_FRAME_INTERVAL;
            }
        } else {
            this.walkFrame = 0;
            this.setTexture(this.idleTexture);
        }
    }

    private updateFootstepSound() {
        const soundsOn = localStorage.getItem("soundsEnabled") !== "false";

        if (this.isMoving() && soundsOn) {
            if (!this.footstepSound.isPlaying) this.footstepSound.play();
        } else {
            if (this.footstepSound.isPlaying) this.footstepSound.stop();
        }
    }
}
