import Phaser from "phaser";

export class MapManager {
    map: Phaser.Tilemaps.Tilemap;

    constructor(scene: Phaser.Scene) {
        this.map = scene.make.tilemap({ key: "mapa" });
        this.createLayers();
    }

    private createLayers() {
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
}
