export class MusicManager {
    private static currentMusic?: Phaser.Sound.BaseSound;
    private static currentKey?: string;

    static play(scene: Phaser.Scene, key: string, volume = 0.05): void {
        const musicEnabled = localStorage.getItem("musicEnabled") !== "false";

        if (!musicEnabled) return;

        if (this.currentKey === key && this.currentMusic?.isPlaying) {
            return;
        }

        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic.destroy();
        }

        this.currentKey = key;
        this.currentMusic = scene.sound.add(key, {
            loop: true,
            volume,
        });

        this.currentMusic.play();
    }

    static pause(): void {
        this.currentMusic?.pause();
    }

    static resume(): void {
        const musicEnabled = localStorage.getItem("musicEnabled") !== "false";

        if (musicEnabled && this.currentMusic?.isPaused) {
            this.currentMusic.resume();
        }
    }

    static stop(): void {
        this.currentMusic?.stop();
        this.currentMusic?.destroy();

        this.currentMusic = undefined;
        this.currentKey = undefined;
    }
}
