import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { PreloaderScene } from "./scenes/PreloaderScene";
import { FarmScene } from "./scenes/FarmScene";
import { HudUI } from "./UI/HudUI";
import { SettingsScene } from "./scenes/SettingsScene";
import { HotbarScene } from "./scenes/HotbarScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: 1280,
    height: 720,

    parent: "game-container",

    backgroundColor: "#1d212d",

    pixelArt: true,
    input: {
        keyboard: true,
        mouse: true,
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    physics: {
        default: "arcade",
        arcade: {
            //gravity: { y: 0 }, nao faz sentido gravidade
            debug: false,
        },
    },

    scene: [
        BootScene,
        PreloaderScene,
        FarmScene,
        HotbarScene,
        HudUI,
        SettingsScene,
    ],
};

export default new Phaser.Game(config);
