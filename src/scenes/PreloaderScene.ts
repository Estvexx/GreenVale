import Phaser from "phaser";
import { preloadUIImages } from "../utils/preloadUIImages";

export class PreloaderScene extends Phaser.Scene {
    private logo!: Phaser.GameObjects.Image;

    constructor() {
        super("PreloaderScene");
    }

    create() {}
    preload() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Calcula o centro vertical (ajusta os valores conforme necessário)
        const centerY = height / 2;

        // Logo (20% acima do centro)
        this.logo = this.add.image(width / 2, centerY - 100, "logo");
        this.logo.setScale(0.5);

        // Texto "A carregar..." (logo abaixo da logo)
        const loadingText = this.add
            .text(width / 2, centerY + 30, "A carregar...", {
                fontSize: "24px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        // Barra de progresso (abaixo do texto)
        this.add.rectangle(width / 2, centerY + 100, width * 0.6, 20, 0x222222);

        const bar = this.add
            .rectangle(
                width / 2 - (width * 0.6) / 2,
                centerY + 100,
                0,
                20,
                0x44aa44,
            )
            .setOrigin(0, 0.5);

        // Percentagem (abaixo da barra)
        const percentText = this.add
            .text(width / 2, centerY + 70, "0%", {
                fontSize: "18px",
                color: "#aaaaaa",
            })
            .setOrigin(0.5);

        // Atualiza a barra
        this.load.on("progress", (progress: number) => {
            bar.width = width * 0.6 * progress;
            percentText.setText(`${Math.floor(progress * 100)}%`);
        });

        this.load.on("complete", () => {
            loadingText.setText("Pronto!");

            this.time.delayedCall(100, () => {
                console.log("A iniciar MainMenuScene...");
                this.scene.start("MainMenuScene");
            });
        });

        // ============ ASSETS ============

        // Player skins
        const skins = ["skin_a", "skin_b", "skin_c", "skin_d"];
        for (const skin of skins) {
            this.load.image(
                `${skin}_idle`,
                `assets/images/players/player_walk2_${skin}.png`,
            );
            this.load.image(
                `${skin}_walk`,
                `assets/images/players/player_walk1_${skin}.png`,
            );
        }

        // Ferramentas
        this.load.image("enxada", "assets/images/tools/Enxada.png");
        this.load.image("balde_vazio", "assets/images/tools/Balde_Vazio.png");
        this.load.image("foice", "assets/images/tools/Foice.png");
        this.load.image("balde_agua", "assets/images/tools/Balde_Agua.png");
        this.load.image("espada_1", "assets/images/tools/Espada_1.png");
        this.load.image("espada_2", "assets/images/tools/Espada_2.png");
        this.load.image("espada_3", "assets/images/tools/Espada_3.png");
        this.load.image("espada_4", "assets/images/tools/Espada_4.png");
        this.load.image("espada_5", "assets/images/tools/Espada_5.png");

        // Tudo relacionado ao mapa farmscene
        this.load.tilemapTiledJSON("mapa", "assets/map/mapa.tmj");
        this.load.image("barcos", "assets/images/map_images/boat.png");
        this.load.image("terras", "assets/images/map_images/dirt.png");
        this.load.image("cercas", "assets/images/map_images/fence.png");
        this.load.image("chao", "assets/images/map_images/ground.png");
        this.load.image("rochas", "assets/images/map_images/rocks.png");
        this.load.image("lojas", "assets/images/map_images/shops.png");
        this.load.image(
            "arvores_e_poco",
            "assets/images/map_images/trees_and_well.png",
        );
        this.load.image("postes", "assets/images/map_images/Postes_luz.png");

        // Tudo relacionado ao mapa bossscene
        this.load.tilemapTiledJSON("mapa_boss", "assets/map/mapa_boss.tmj");
        this.load.image(
            "terras_boss",
            "assets/images/map_images/ground_boss.png",
        );
        this.load.image(
            "decoracao_boss",
            "assets/images/map_images/decoracao_boss.png",
        );
        this.load.image(
            "particle_red",
            "assets/images/effects/particle_red.png",
        );

        // Mobs
        this.load.spritesheet("zombie", "assets/images/mobs/ZombieSheet.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("slime", "assets/images/mobs/SlimeSheet.png", {
            frameWidth: 64,
            frameHeight: 32,
        });
        this.load.spritesheet("bear", "assets/images/mobs/BearSheet.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Relacionado a plantação
        this.load.spritesheet("frutas", "assets/images/Fruits.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        //VASCO esta e tua spriteSheet para as plantas, tem 4 linhas (uma para cada tipo de planta) e 8 colunas (uma para cada estágio de crescimento)
        this.load.spritesheet("stages", "assets/images/Stages.png", {
            frameWidth: 32,
            frameHeight: 37,
        });

        // Musica e sons
        this.load.audio("farmScene_music", "assets/audio/farmscene_music.ogg");
        this.load.audio("bossscene_music", "assets/audio/bossscene_music.ogg");
        this.load.audio("click_sound", "assets/audio/click.ogg");
        this.load.audio("error_sound", "assets/audio/error.ogg");
        this.load.audio("fire_sound", "assets/audio/fire_sound.ogg");
        this.load.audio("inventory_sound", "assets/audio/inventory.ogg");
        this.load.audio("punch_sound", "assets/audio/punch_sound.ogg");
        this.load.audio("setpdirt_sound", "assets/audio/setpdirt.ogg");

        preloadUIImages();
    }
}
