import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.cursorKeys = scene.input.keyboard!.createCursorKeys();

    //const shadow = scene.add.ellipse(x, y + 20, 40, 12, 0x000000, 0.3);
    //scene.physics.add.existing(shadow);
  }

  update() {
    const speed = 200;

    this.setVelocity(0);

    if (this.cursorKeys.left.isDown) {
      this.setVelocityX(-speed);
      this.setFlipX(true);
    }

    if (this.cursorKeys.right.isDown) {
      this.setVelocityX(speed);
      this.setFlipX(false);
    }

    if (this.cursorKeys.up.isDown) {
      this.setVelocityY(-speed);
    }

    if (this.cursorKeys.down.isDown) {
      this.setVelocityY(speed);
    }
  }
}
