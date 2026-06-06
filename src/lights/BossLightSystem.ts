import Phaser from "phaser";
import { MapManager } from "../map/MapManager";

type Glow = {
    image: Phaser.GameObjects.Image;
    baseAlpha: number;
};

export class BossLightSystem {
    private scene: Phaser.Scene;
    private mapManager: MapManager;

    private glows: Glow[] = [];

    constructor(scene: Phaser.Scene, mapManager: MapManager) {
        this.scene = scene;
        this.mapManager = mapManager;

        this.createTextures();
        this.createCauldronLights();
        this.createBossLights();
    }

    private createTextures() {
        this.createGlowTexture("boss_red_glow", [
            "rgba(255, 80, 40, 0.9)",
            "rgba(255, 40, 20, 0.45)",
            "rgba(180, 0, 0, 0.18)",
            "rgba(120, 0, 0, 0)",
        ]);

        this.createGlowTexture("boss_dark_glow", [
            "rgba(190, 80, 255, 0.95)",
            "rgba(120, 40, 220, 0.55)",
            "rgba(70, 0, 160, 0.25)",
            "rgba(30, 0, 80, 0)",
        ]);
    }

    private createGlowTexture(key: string, colors: string[]) {
        if (this.scene.textures.exists(key)) return;

        const size = 256;
        const texture = this.scene.textures.createCanvas(key, size, size);

        if (!texture) return;

        const ctx = texture.context;
        const center = size / 2;

        const gradient = ctx.createRadialGradient(
            center,
            center,
            0,
            center,
            center,
            center,
        );

        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.25, colors[1]);
        gradient.addColorStop(0.6, colors[2]);
        gradient.addColorStop(1, colors[3]);

        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        texture.refresh();
    }

    private createCauldronLights() {
        this.mapManager.getLightObjects().forEach((obj) => {
            const x = obj.x ?? 0;
            const y = obj.y ?? 0;

            const glow = this.scene.add.image(x, y - 35, "boss_red_glow");

            glow.setDepth(8);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            glow.setScale(0.65, 1.05);
            glow.setAlpha(0.55);

            this.glows.push({
                image: glow,
                baseAlpha: 0.55,
            });
        });
    }

    private createBossLights() {
        this.mapManager.getBossLightObjects().forEach((obj) => {
            const x = obj.x ?? 0;
            const y = obj.y ?? 0;

            const glow = this.scene.add.image(x, y, "boss_dark_glow");

            glow.setDepth(7);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            glow.setScale(1.5);
            glow.setAlpha(0.45);

            this.glows.push({
                image: glow,
                baseAlpha: 0.45,
            });
        });
    }

    update() {
        // Por agora não precisa de nada.
        // Se quiseres pulsar as luzes depois, fazes aqui.
    }
}
