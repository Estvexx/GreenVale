import Phaser from "phaser";

export class MenuBackgroundScene extends Phaser.Scene {
    private bg!: Phaser.GameObjects.TileSprite;

    constructor() {
        super({ key: "MenuBackgroundScene", active: false });
    }

    create() {
        const { width, height } = this.scale;

        // imagem do mapa em tile sprite para fazer scroll lento
        this.bg = this.add.tileSprite(0, 0, width, height, "menu_background")
            .setOrigin(0, 0);

        // ajustar escala para cobrir o ecrã mantendo aspeto
        const scaleX = width / 1920;
        const scaleY = height / 1080;
        const scale = Math.max(scaleX, scaleY);
        this.bg.setTileScale(scale, scale);

        // overlay escuro suave para os botões se destacarem
        this.add.rectangle(0, 0, width, height, 0x000000, 0.55).setOrigin(0, 0);
    }

    update(_: number, delta: number) {
        this.bg.tilePositionX += 0.3 * (delta / 16);
    }
}
