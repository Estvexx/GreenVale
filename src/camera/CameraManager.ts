import Phaser from "phaser";
import { Player } from "../entities/Player";

export class CameraManager {
    constructor(
        scene: Phaser.Scene,
        player: Player,
        map: Phaser.Tilemaps.Tilemap,
    ) {
        const camera = scene.cameras.main;

        camera.startFollow(player, true, 0.05, 0.05, 0, 0);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }
}
