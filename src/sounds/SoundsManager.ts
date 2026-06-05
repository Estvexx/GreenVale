export class SoundManager {
    private static scene?: Phaser.Scene;

    static setScene(scene: Phaser.Scene): void {
        this.scene = scene;
    }

    static isEnabled(): boolean {
        return localStorage.getItem("soundsEnabled") !== "false";
    }

    static setEnabled(enabled: boolean): void {
        localStorage.setItem("soundsEnabled", String(enabled));
    }

    static play(key: string, volume = 1): void {
        if (!this.isEnabled()) return;
        if (!this.scene) return;

        this.scene.sound.play(key, { volume });
    }
}
