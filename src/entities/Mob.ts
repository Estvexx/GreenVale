import Phaser from "phaser";
import { MoneySystem } from "../systems/MoneySystem";

export class Mob extends Phaser.Physics.Arcade.Sprite {
    private maxHp: number;
    private hp: number;
    private kills = 0;

    private hpText: Phaser.GameObjects.Text;
    private bossCoinDropChance: number;
    private bossCoinBonusChance: number;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame: number,
        hp: number,

        bossCoinDropChance: number,
        bossCoinBonusChance: number,
    ) {
        super(scene, x, y, texture, frame);

        this.maxHp = hp;
        this.hp = hp;
        this.bossCoinDropChance = bossCoinDropChance;
        this.bossCoinBonusChance = bossCoinBonusChance;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.5);

        this.setDepth(11);
        this.setImmovable(true);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setAllowGravity(false);
        body.setVelocity(0, 0);

        this.hpText = scene.add.text(this.x, this.y - 28, "", {
            fontSize: "12px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3,
        });

        this.hpText.setOrigin(0.5);
        this.hpText.setDepth(11);

        this.updateHpText();
    }

    takeDamage(amount: number) {
        this.hp -= amount;

        if (this.hp <= 0) {
            this.die();
            return;
        }

        this.updateHpText();
    }

    private updateHpText() {
        this.hpText.setText(
            `HP: ${this.hp}/${this.maxHp}\nKills: ${this.kills}`,
        );
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        this.hpText.setPosition(this.x, this.y - 28);
    }

    destroy(fromScene?: boolean) {
        this.hpText.destroy();
        super.destroy(fromScene);
    }

    private die() {
        this.kills++;

        this.tryDropBossCoin();

        this.anims.stop();
        this.setFrame(15);

        this.updateHpText();

        this.disableInteractive();

        this.scene.time.delayedCall(800, () => {
            this.revive();
        });
    }

    private revive() {
        this.hp = this.maxHp;

        this.setInteractive();

        const idleAnim = `${this.texture.key}_idle`;

        if (this.scene.anims.exists(idleAnim)) {
            this.play(idleAnim);
        } else {
            this.setFrame(0);
        }

        this.updateHpText();
    }

    private tryDropBossCoin() {
        if (Math.random() > this.bossCoinDropChance) {
            console.log(this.bossCoinDropChance);
            console.log("Não caiu boss coin.");
            return;
        }
        console.log(this.bossCoinDropChance);
        let amount = 1;

        if (Math.random() <= this.bossCoinBonusChance) {
            amount++;
        }

        MoneySystem.getInstance().add("bossTokens", amount);

        console.log(`Ganhaste ${amount} boss coin(s)!`);
    }
}
