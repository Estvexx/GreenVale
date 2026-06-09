import Phaser from "phaser";

const LAYERS = [
    { key: "chao",          speed: 0.2, y: 0,   alpha: 1   },
    { key: "terras",        speed: 0.4, y: 0,   alpha: 1   },
    { key: "arvores_e_poco",speed: 0.7, y: 0,   alpha: 1   },
];

export class MenuBackgroundScene extends Phaser.Scene {
    private layers: { img: Phaser.GameObjects.TileSprite; speed: number }[] = [];

    constructor() {
        super({ key: "MenuBackgroundScene", active: false });
    }

    create() {
        const { width, height } = this.scale;

        for (const def of LAYERS) {
            const tex = this.textures.get(def.key);
            const texH = tex.getSourceImage().height as number;
            const scaleY = height / texH;

            const img = this.add.tileSprite(0, 0, width, height, def.key)
                .setOrigin(0, 0)
                .setAlpha(def.alpha);

            img.tileScaleY = scaleY;
            img.tileScaleX = scaleY; // manter pixel ratio

            this.layers.push({ img, speed: def.speed });
        }

        // overlay escuro para contraste com o menu
        this.add.rectangle(0, 0, width, height, 0x000000, 0.45).setOrigin(0, 0);
    }

    update(_: number, delta: number) {
        for (const layer of this.layers) {
            layer.img.tilePositionX += layer.speed * (delta / 16);
        }
    }
}
