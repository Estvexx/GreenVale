import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { PreloaderScene } from "./scenes/PreloaderScene";
import { FarmScene } from "./scenes/FarmScene";
import { BossScene } from "./scenes/BossScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: window.innerWidth,
    height: window.innerHeight,

    parent: "game-container",

    backgroundColor: "#1d212d",
    pixelArt: true,

    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: true,
        },
    },

    scene: [BootScene, PreloaderScene, FarmScene, BossScene],
};

export default new Phaser.Game(config);
