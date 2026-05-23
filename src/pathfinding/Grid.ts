export class Grid {
    private grid: number[][];
    public readonly width: number;
    public readonly height: number;

    constructor(map: Phaser.Tilemaps.Tilemap) {
        this.width = map.width; // 50
        this.height = map.height; // 50

        this.grid = this.buildGrid(map);
    }

    private buildGrid(map: Phaser.Tilemaps.Tilemap): number[][] {
        const layer = map.getLayer("Collision");

        // Cria matriz 50x50 preenchida com 0
        const grid: number[][] = Array.from({ length: this.height }, () =>
            new Array(this.width).fill(0),
        );

        layer?.data.forEach((row, y) => {
            row.forEach((tile, x) => {
                // 680 é o tile de colisão
                grid[y][x] = tile.index === 680 ? 1 : 0;
            });
        });

        return grid;
    }

    public isWalkable(x: number, y: number): boolean {
        // Verifica se está dentro dos limites e se é passável
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
        return this.grid[y][x] === 0;
    }

    public getGrid(): number[][] {
        return this.grid;
    }
}
