export function changeScene(scene: Phaser.Scene, sceneKey: string) {
    scene.cameras.main.fadeOut(500, 0, 0, 0);

    scene.time.delayedCall(500, () => {
        scene.scene.start(sceneKey);
    });
}
