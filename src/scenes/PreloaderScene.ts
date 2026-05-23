import Phaser from "phaser";

export class PreloaderScene extends Phaser.Scene {
    private logo!: Phaser.GameObjects.Image;

    constructor() {
        super("PreloaderScene");
    }
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

            this.time.delayedCall(500, () => {
                console.log("A iniciar FarmScene...");
                this.scene.start("FarmScene");
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

        // Tudo relacionado ao mapa
        this.load.tilemapTiledJSON("farm", "assets/maps/mapa_final.tmj");
        this.load.image(
            "Armazem_Green",
            "assets/images/map_images/Supplies.png",
        );
        this.load.image("Cercas", "assets/images/map_images/fence_alt.png");
        this.load.image("Collider", "assets/images/map_images/collider.png");
        this.load.image(
            "Fields TileSet",
            "assets/images/map_images/FieldsTileset.png",
        );
        this.load.image("Ground", "assets/images/map_images/TileSet_V1.png");
        this.load.image(
            "Ground Details",
            "assets/images/map_images/TX Props.png",
        );
        this.load.image("Tenda", "assets/images/map_images/1.png");
        this.load.image("Tenda Venda", "assets/images/map_images/4.png");
        this.load.image(
            "Terra Lavrada",
            "assets/images/map_images/terrain.png",
        );
        this.load.image("TileSet", "assets/images/map_images/Tileset2.png");
        this.load.image("Trees", "assets/images/map_images/spr_tree_9.png");

        // Musica e sons
        this.load.audio("bgMusic", "assets/audio/apple_cider.ogg");
    }
}
