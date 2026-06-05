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

        const handleResize = (gameSize: Phaser.Structs.Size) => {
            if (!camera.scene || !(camera as unknown as { _bounds?: unknown })._bounds) {
                removeResizeListener();
                return;
            }

            camera.setSize(gameSize.width, gameSize.height);
        };

        const removeResizeListener = () => {
            scene.scale.off("resize", handleResize);
        };

        scene.scale.on("resize", handleResize);
        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, removeResizeListener);
        scene.events.once(Phaser.Scenes.Events.DESTROY, removeResizeListener);
    }
}
