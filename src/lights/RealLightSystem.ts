import Phaser from "phaser";
import { MapManager } from "../map/MapManager";
import { TimeSystem } from "../systems/TimeSystem";

type LightGlow = {
    image: Phaser.GameObjects.Image;
    baseAlpha: number;
};

export class RealLightSystem {
    private scene: Phaser.Scene;
    private mapManager: MapManager;
    private time = TimeSystem.getInstance();

    private glows: LightGlow[] = [];

    constructor(scene: Phaser.Scene, mapManager: MapManager) {
        this.scene = scene;
        this.mapManager = mapManager;

        this.createGlowTexture();
        this.createLights();
    }

    private createGlowTexture() {
        const key = "soft_light_glow";

        if (this.scene.textures.exists(key)) return;

        const size = 256;
        const texture = this.scene.textures.createCanvas(key, size, size);

        if (!texture) return;

        const context = texture.context;
        const center = size / 2;

        const gradient = context.createRadialGradient(
            center,
            center,
            0,
            center,
            center,
            center,
        );

        gradient.addColorStop(0, "rgba(255, 245, 190, 0.85)");
        gradient.addColorStop(0.18, "rgba(255, 195, 95, 0.45)");
        gradient.addColorStop(0.45, "rgba(255, 130, 40, 0.18)");
        gradient.addColorStop(0.75, "rgba(255, 80, 20, 0.06)");
        gradient.addColorStop(1, "rgba(255, 80, 20, 0)");

        context.clearRect(0, 0, size, size);
        context.fillStyle = gradient;
        context.fillRect(0, 0, size, size);

        texture.refresh();
    }

    private createLights() {
        console.log(
            "Luzes encontradas:",
            this.mapManager.getLightObjects().length,
        );

        this.mapManager.getLightObjects().forEach((obj) => {
            const x = (obj.x ?? 0) + (obj.width ?? 0) / 2;
            const y = (obj.y ?? 0) + (obj.height ?? 0) / 2;

            const glow = this.scene.add.image(x, y, "soft_light_glow");

            glow.setDepth(8); // posiçao digamos assim
            glow.setBlendMode(Phaser.BlendModes.ADD);
            glow.setScale(2); // Aumentar tamanho da luz
            glow.setAlpha(0);

            this.scene.tweens.add({
                targets: glow,
                scale: 0.95,
                duration: Phaser.Math.Between(1200, 1800),
                yoyo: true,
                repeat: -1,
            });

            this.glows.push({
                image: glow,
                baseAlpha: 0.7,
            });
        });
    }

    update() {
        const darkness = this.time.getDarkness();

        this.glows.forEach((glow) => {
            if (darkness < 0.54) {
                glow.image.setAlpha(0);
                return;
            }

            const alpha = Math.min(glow.baseAlpha, darkness * 2);

            glow.image.setAlpha(alpha);
        });
    }
}
