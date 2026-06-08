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

    constructor(scene: Phaser.Scene, x: number, y: number) {
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
    }

    private handleMovement() {
        const speed = Player.BASE_SPEED * this.effects.getSpeedMultiplier();

        this.setVelocity(0);

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
    }

    private updateAnimation(time: number) {
        const isMoving =
            this.body!.velocity.x !== 0 || this.body!.velocity.y !== 0;

        if (this.body!.velocity.x > 0) this.setFlipX(false);
        else if (this.body!.velocity.x < 0) this.setFlipX(true);

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

    private updateFootstepSound() {
        const isMoving =
            this.body!.velocity.x !== 0 || this.body!.velocity.y !== 0;

        const soundsEnabled = localStorage.getItem("soundsEnabled") !== "false";

        if (isMoving && soundsEnabled) {
            if (!this.footstepSound.isPlaying) {
                this.footstepSound.play();
            }
        } else {
            if (this.footstepSound.isPlaying) {
                this.footstepSound.stop();
            }
        }
    }
}
