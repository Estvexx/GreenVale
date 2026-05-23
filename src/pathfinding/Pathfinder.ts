import { Grid } from "./Grid";
import { AStar } from "./AStar";

export class Pathfinder {
    private grid: Grid;
    private aStar: AStar;
    private tileSize: number = 32;

    constructor(map: Phaser.Tilemaps.Tilemap) {
        this.grid = new Grid(map);
        this.aStar = new AStar(this.grid);
    }

    // Recebe coordenadas do mundo (píxeis) e devolve waypoints em píxeis
    public findPath(
        startWorldX: number,
        startWorldY: number,
        endWorldX: number,
        endWorldY: number,
    ): { x: number; y: number }[] {
        // Converte píxeis → tiles
        const startTileX = Math.floor(startWorldX / this.tileSize);
        const startTileY = Math.floor(startWorldY / this.tileSize);
        const endTileX = Math.floor(endWorldX / this.tileSize);
        const endTileY = Math.floor(endWorldY / this.tileSize);

        const tilePath = this.aStar.findPath(
            startTileX,
            startTileY,
            endTileX,
            endTileY,
        );

        // Converte tiles → píxeis (centro do tile)
        return tilePath.map((tile) => ({
            x: tile.x * this.tileSize + this.tileSize / 2,
            y: tile.y * this.tileSize + this.tileSize / 2,
        }));
    }
}
