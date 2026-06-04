import Phaser from "phaser";
import { Player } from "../entities/Player";

export type CameraProfile = "farm" | "boss";

export class CameraManager {
    constructor(
        scene: Phaser.Scene,
        player: Player,
        map: Phaser.Tilemaps.Tilemap,
        profile: CameraProfile = "farm",
    ) {
        const camera = scene.cameras.main;

        const followLerp = profile === "boss" ? 0.08 : 0.05;

        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        camera.startFollow(player, true, followLerp, followLerp);

        camera.roundPixels = true;

        if (profile === "boss") {
            camera.setZoom(2);
        } else {
            camera.setZoom(1.3);
        }

        scene.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
            camera.setSize(gameSize.width, gameSize.height);

            camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        });
    }
}
