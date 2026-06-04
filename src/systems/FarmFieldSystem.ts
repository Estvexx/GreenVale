import Phaser from "phaser";
import { LevelSystem } from "../systems/LevelSystem";

type FieldCell = {
    requiredLevel: number;
    rect: Phaser.Geom.Rectangle;
    overlay: Phaser.GameObjects.Rectangle;
};

export class FarmFieldSystem {
    private levelSystem = LevelSystem.getInstance();

    private scene: Phaser.Scene;
    private map: Phaser.Tilemaps.Tilemap;

    private cells: FieldCell[] = [];

    constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
        this.scene = scene;
        this.map = map;

        this.createFields();

        this.levelSystem.onChange(() => {
            this.updateVisuals();
        });

        this.updateVisuals();
    }

    private createFields() {
        const fields = [
            { layer: "Field_1", requiredLevel: 1 },
            { layer: "Field_2", requiredLevel: 4 },
            { layer: "Field_3", requiredLevel: 10 },
            { layer: "Field_4", requiredLevel: 20 },
        ];

        fields.forEach((field) => {
            const objectLayer = this.map.getObjectLayer(field.layer);

            if (!objectLayer) {
                console.log(`Layer não encontrada: ${field.layer}`);
                return;
            }

            objectLayer.objects.forEach((obj) => {
                const x = obj.x ?? 0;
                const y = obj.y ?? 0;
                const width = obj.width ?? this.map.tileWidth;
                const height = obj.height ?? this.map.tileHeight;

                const overlay = this.scene.add.rectangle(
                    x + width / 2,
                    y + height / 2,
                    width,
                    height,
                    0x111111,
                    0.65,
                );

                overlay.setDepth(100);
                overlay.setVisible(false);

                this.cells.push({
                    requiredLevel: field.requiredLevel,
                    rect: new Phaser.Geom.Rectangle(x, y, width, height),
                    overlay,
                });
            });
        });
    }

    private updateVisuals() {
        const level = this.levelSystem.getLevel();

        this.cells.forEach((cell) => {
            const locked = level < cell.requiredLevel;
            cell.overlay.setVisible(locked);
        });
    }

    canFarmAt(x: number, y: number): boolean {
        const cell = this.cells.find((cell) => {
            return cell.rect.contains(x, y);
        });

        if (!cell) return false;

        return this.levelSystem.getLevel() >= cell.requiredLevel;
    }

    getRequiredLevelAt(x: number, y: number): number | null {
        const cell = this.cells.find((cell) => {
            return cell.rect.contains(x, y);
        });

        return cell?.requiredLevel ?? null;
    }
}
