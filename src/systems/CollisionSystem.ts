import Phaser from "phaser";
import { Player } from "../entities/Player";
import { MapManager } from "../map/MapManager";

export class CollisionSystem {
    private scene: Phaser.Scene;
    private player: Player;
    private mapManager: MapManager;

    constructor(scene: Phaser.Scene, player: Player, mapManager: MapManager) {
        this.scene = scene;
        this.player = player;
        this.mapManager = mapManager;

        this.createCollisions();
    }

    private createCollisions() {
        this.mapManager.getCollisionObjects().forEach((obj) => {
            const rect = this.scene.add.rectangle(
                obj.x! + obj.width! / 2,
                obj.y! + obj.height! / 2,
                obj.width!,
                obj.height!,
            );

            this.scene.physics.add.existing(rect, true);
            this.scene.physics.add.collider(this.player, rect);
        });
    }
}
