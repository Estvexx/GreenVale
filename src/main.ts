import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { PreloaderScene } from "./scenes/PreloaderScene";
import { FarmScene } from "./scenes/FarmScene";
import { HudUI } from "./UI/HudUI";
//import { HotbarScene } from "./scenes/HotbarScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: 1920,
    height: 1080,

    parent: "game-container",

    backgroundColor: "#1d212d",

    pixelArt: true,
    input: {
        keyboard: true,
        mouse: true,
    },

    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    physics: {
        default: "arcade",
        arcade: {
            //gravity: { y: 0 }, nao faz sentido gravidade
            debug: true,
        },
    },

    scene: [BootScene, PreloaderScene, FarmScene /* HotbarScene*/, HudUI],
};

export default new Phaser.Game(config);
