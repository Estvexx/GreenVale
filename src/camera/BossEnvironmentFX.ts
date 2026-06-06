import Phaser from "phaser";

export class BossEnvironmentFX {
    private scene: Phaser.Scene;
    private overlay!: Phaser.GameObjects.Rectangle;
    private particles!: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        console.log("BossEnvironmentFX ativo");

        this.createRedOverlay();
        this.createLavaParticles();
        console.log(this.scene.textures.exists("particle_red"));
    }

    private createRedOverlay() {
        const camera = this.scene.cameras.main;

        this.overlay = this.scene.add.rectangle(
            0,
            0,
            camera.width,
            camera.height,
            0xff0000,
            0.75,
        );

        this.overlay.setOrigin(0);
        this.overlay.setScrollFactor(0);
        this.overlay.setDepth(999);

        this.scene.tweens.add({
            targets: this.overlay,
            alpha: { from: 0.12, to: 0.25 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
        });

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
        this.scene.events.once(Phaser.Scenes.Events.DESTROY, removeResizeListener);

    private createLavaParticles() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        this.particles = this.scene.add.particles(
            width / 2,
            height / 2,
            "particle_red",
            {
                x: { min: -width / 2, max: width / 2 },
                y: { min: -height / 2, max: height / 2 },

                lifespan: 2500,

                speedY: { min: -20, max: -80 },
                speedX: { min: -20, max: 20 },

                scale: { start: 2.2, end: 0 },
                alpha: { start: 0.8, end: 0 },

                quantity: 3,
                frequency: 100,

                blendMode: Phaser.BlendModes.ADD,
            },
        );

        this.particles.setScrollFactor(0);
        this.particles.setDepth(10000);
    }
}
