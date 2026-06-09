import Phaser from "phaser";

export type MapType = "farm" | "boss";

export class MapManager {
    map: Phaser.Tilemaps.Tilemap;

    public lightLayers: Phaser.Tilemaps.TilemapLayer[] = [];
    public poleLayer: Phaser.Tilemaps.TilemapLayer | null = null;

    private mapType: MapType;

    constructor(scene: Phaser.Scene, mapType: MapType = "farm") {
        this.mapType = mapType;

        this.map = scene.make.tilemap({
            key: this.mapType === "farm" ? "mapa" : "mapa_boss",
        });

        this.createLayers();
    }

    private createLayers() {
        if (this.mapType === "boss") {
            this.createBossLayers();
            return;
        }

        this.createFarmLayers();
    }

    private addLayer(
        name: string,
        tileset: Phaser.Tilemaps.Tileset | Phaser.Tilemaps.Tileset[],
        depth: number,
    ) {
        const layer = this.map.createLayer(name, tileset);

        if (!layer) return;

        layer.setDepth(depth);

        this.lightLayers.push(layer as Phaser.Tilemaps.TilemapLayer);
    }

    private createFarmLayers() {
        const tsGround = this.map.addTilesetImage("TileSet_Ground", "chao")!;
        this.addLayer("Ground", tsGround, 0);

        const tsFarmable = this.map.addTilesetImage("Terras_Aradas", "terras")!;
        this.addLayer("Farmable Layer", tsFarmable, 1);

        const tsFence = this.map.addTilesetImage("Fence", "cercas")!;
        const tsBoat = this.map.addTilesetImage("boat", "barcos")!;
        const tsRocks = this.map.addTilesetImage("Rocks", "rochas")!;
        const tsPlantsandWell = this.map.addTilesetImage(
            "Plantacao_Poco",
            "arvores_e_poco",
        )!;

        const tsPoles = this.map.addTilesetImage("Postes_luz", "postes")!;

        this.addLayer(
            "Decoration",
            [tsFence, tsBoat, tsRocks, tsPlantsandWell],
            2,
        );

        this.addLayer("Trees", tsPlantsandWell, 3);
        this.addLayer("Trees2", tsPlantsandWell, 4);
        this.addLayer("Trees3", tsPlantsandWell, 5);

        const tsBuildings = this.map.addTilesetImage("Shops", "lojas")!;

        this.addLayer("Buildings", [tsBuildings, tsPlantsandWell], 3);

        const poleLayer = this.map.createLayer("LightPostsVisual", tsPoles) as unknown as Phaser.Tilemaps.TilemapLayer | null;
        if (poleLayer) {
            poleLayer.setDepth(11);
            this.poleLayer = poleLayer;
            this.lightLayers.push(poleLayer);
        }
    }

    private createBossLayers() {
        const tsGroundBoss = this.map.addTilesetImage(
            "ground_boss",
            "terras_boss",
        )!;

        this.addLayer("Ground", tsGroundBoss, 0);

        const tsDecorationBoss = this.map.addTilesetImage(
            "Decoracao_boss",
            "decoracao_boss",
        )!;

        this.addLayer("Decoration", tsDecorationBoss, 1);
    }

    getSpawnPoint(): Phaser.Types.Tilemaps.TiledObject | undefined {
        if (this.mapType === "boss") {
            return (
                this.map.getObjectLayer("Spawnpoint")?.objects[0] ??
                this.map.getObjectLayer("SpawnPoint")?.objects[0]
            );
        }

        return this.map.getObjectLayer("SpawnPoint")?.objects[0];
    }

    getCollisionObjects(): Phaser.Types.Tilemaps.TiledObject[] {
        return this.map.getObjectLayer("Collision")?.objects ?? [];
    }

    getInteractables(): Phaser.Types.Tilemaps.TiledObject[] {
        if (this.mapType === "boss") {
            return (
                this.map.getObjectLayer("Interectables")?.objects ??
                this.map.getObjectLayer("Interactables")?.objects ??
                []
            );
        }

        return this.map.getObjectLayer("Interactables")?.objects ?? [];
    }

    getBossSpawns(): Phaser.Types.Tilemaps.TiledObject[] {
        return this.map.getObjectLayer("BossSpawn")?.objects ?? [];
    }

    getBossSpawnByName(name: string): Phaser.Types.Tilemaps.TiledObject | null {
        return (
            this.getBossSpawns().find((spawn) => spawn.name === name) ?? null
        );
    }

    getLightObjects(): Phaser.Types.Tilemaps.TiledObject[] {
        return this.map.getObjectLayer("Lights")?.objects ?? [];
    }

    getBossLightObjects(): Phaser.Types.Tilemaps.TiledObject[] {
        return this.map.getObjectLayer("Lights_Bosses")?.objects ?? [];
    }
}
