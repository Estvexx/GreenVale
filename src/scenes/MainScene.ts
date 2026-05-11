import Phaser from "phaser";
import { Player } from "../entities/Player";

export class MainScene extends Phaser.Scene {
  private player!: Player;

  constructor() {
    super("main-scene");
  }

  preload() {
    this.load.image("player", "assets/images/player_walk1.png");
  }

  create() {
    this.add.text(10, 10, "GreenVale", {
      fontSize: "64px",
      color: "#ffffff",
      backgroundColor: "#b6b6b6",
    });
    this.scene.launch("hud-ui");
    this.player = new Player(this, 400, 300);
  }

  update() {
    this.player.update();
  }
}
