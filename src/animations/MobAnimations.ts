import Phaser from "phaser";

export function createMobAnimations(scene: Phaser.Scene) {
    createAnimation(scene, "zombie_idle", "zombie", [0, 1], 3);
    createAnimation(scene, "slime_idle", "slime", [0, 1], 3);
    createAnimation(scene, "bear_idle", "bear", [0, 1], 3);
}

function createAnimation(
    scene: Phaser.Scene,
    key: string,
    texture: string,
    frames: number[],
    frameRate: number,
) {
    if (scene.anims.exists(key)) return;

    scene.anims.create({
        key,
        frames: frames.map((frame) => ({
            key: texture,
            frame,
        })),
        frameRate,
        repeat: -1,
    });
}
