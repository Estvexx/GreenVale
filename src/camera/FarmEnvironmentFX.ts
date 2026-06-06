import Phaser from "phaser";
import { TimeSystem } from "../systems/TimeSystem";

export class FarmEnvironmentFX {
    private scene: Phaser.Scene;
    private time = TimeSystem.getInstance();

    private overlay!: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.createNightOverlay();
    }

    private createNightOverlay() {
        const camera = this.scene.cameras.main;

        this.overlay = this.scene.add.rectangle(
            0,
            0,
            camera.width,
            camera.height,
            0x000022,
            1,
        );

        this.overlay.setOrigin(0);
        this.overlay.setScrollFactor(0);
        this.overlay.setDepth(999);

        const handleResize = (gameSize: Phaser.Structs.Size) => {
            if (!this.overlay.scene) {
                removeResizeListener();
                return;
            }

            this.overlay.setSize(gameSize.width, gameSize.height);
        };

        const removeResizeListener = () => {
            this.scene.scale.off("resize", handleResize);
        };

        this.scene.scale.on("resize", handleResize);

        this.scene.events.once(
            Phaser.Scenes.Events.SHUTDOWN,
            removeResizeListener,
        );

        this.scene.events.once(
            Phaser.Scenes.Events.DESTROY,
            removeResizeListener,
        );
    }

    update(delta: number) {
        this.time.update(delta);

        const style = this.getOverlayStyle();

        this.overlay.setFillStyle(style.color, style.alpha);
    }

    private getOverlayStyle(): { color: number; alpha: number } {
        const hour = this.time.getHour() + this.time.getMinute() / 60;

        const nightColor = 0x000022;
        const dayColor = 0xffffff;
        const sunsetColor = 0xff8c32;

        if (hour >= 21 || hour < 5) {
            return {
                color: nightColor,
                alpha: 0.55,
            };
        }

        if (hour >= 5 && hour < 7) {
            const progress = (hour - 5) / 2;

            return {
                color: this.mixColor(nightColor, dayColor, progress),
                alpha: this.lerp(0.55, 0.04, progress),
            };
        }

        if (hour >= 7 && hour < 17) {
            return {
                color: dayColor,
                alpha: 0.02,
            };
        }

        if (hour >= 17 && hour < 19) {
            const progress = (hour - 17) / 2;

            return {
                color: sunsetColor,
                alpha: this.lerp(0.08, 0.28, progress),
            };
        }

        if (hour >= 19 && hour < 21) {
            const progress = (hour - 19) / 2;

            return {
                color: this.mixColor(sunsetColor, nightColor, progress),
                alpha: this.lerp(0.28, 0.55, progress),
            };
        }

        return {
            color: dayColor,
            alpha: 0.02,
        };
    }

    private lerp(start: number, end: number, amount: number): number {
        return start + (end - start) * amount;
    }

    private mixColor(from: number, to: number, amount: number): number {
        const r1 = (from >> 16) & 255;
        const g1 = (from >> 8) & 255;
        const b1 = from & 255;

        const r2 = (to >> 16) & 255;
        const g2 = (to >> 8) & 255;
        const b2 = to & 255;

        const r = Math.round(this.lerp(r1, r2, amount));
        const g = Math.round(this.lerp(g1, g2, amount));
        const b = Math.round(this.lerp(b1, b2, amount));

        return Phaser.Display.Color.GetColor(r, g, b);
    }
}
