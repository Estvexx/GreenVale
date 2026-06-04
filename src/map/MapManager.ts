import Phaser from "phaser";

export type MapType = "farm" | "boss";

export class MapManager {
    map: Phaser.Tilemaps.Tilemap;
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

    private createFarmLayers() {
        const tsGround = this.map.addTilesetImage("TileSet_Ground", "chao")!;
        this.map.createLayer("Ground", tsGround)?.setDepth(0);

        const tsFarmable = this.map.addTilesetImage("Terras_Aradas", "terras")!;
        this.map.createLayer("Farmable Layer", tsFarmable)?.setDepth(1);

        const tsFence = this.map.addTilesetImage("Fence", "cercas")!;
        const tsBoat = this.map.addTilesetImage("boat", "barcos")!;
        const tsRocks = this.map.addTilesetImage("Rocks", "rochas")!;
        const tsPlantsandWell = this.map.addTilesetImage(
            "Plantacao_Poco",
            "arvores_e_poco",
        )!;

        this.map
            .createLayer("Decoration", [
                tsFence,
                tsBoat,
                tsRocks,
                tsPlantsandWell,
            ])
            ?.setDepth(2);
        this.map.createLayer("Trees", tsPlantsandWell)?.setDepth(3);
        this.map.createLayer("Trees2", tsPlantsandWell)?.setDepth(4);
        this.map.createLayer("Trees3", tsPlantsandWell)?.setDepth(5);

        const tsBuildings = this.map.addTilesetImage("Shops", "lojas")!;
        this.map
            .createLayer("Buildings", [tsBuildings, tsPlantsandWell])
            ?.setDepth(3);
    }

    private createBossLayers() {
        const tsGroundBoss = this.map.addTilesetImage(
            "ground_boss",
            "terras_boss",
        )!;
        this.map.createLayer("Ground", tsGroundBoss)?.setDepth(0);

        const tsDecorationBoss = this.map.addTilesetImage(
            "Decoracao_boss",
            "decoracao_boss",
        )!;
        this.map.createLayer("Decoration", tsDecorationBoss)?.setDepth(1);
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
}
