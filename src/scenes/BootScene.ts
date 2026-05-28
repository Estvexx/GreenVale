import Phaser from "phaser";
import { applyTranslations } from "../i18n/index";

export class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        this.load.image("logo", "assets/images/BootImage.png");
    }

    create() {
        applyTranslations();
        this.scene.start("PreloaderScene");
    }
}
