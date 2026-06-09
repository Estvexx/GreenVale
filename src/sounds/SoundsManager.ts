export class SoundManager {
    private static scene?: Phaser.Scene;
    private static listeners: ((enabled: boolean) => void)[] = [];

    static setScene(scene: Phaser.Scene): void {
        this.scene = scene;
    }

    static isEnabled(): boolean {
        return localStorage.getItem("soundsEnabled") !== "false";
    }

    static setEnabled(enabled: boolean): void {
        localStorage.setItem("soundsEnabled", String(enabled));
        this.listeners.forEach(fn => fn(enabled));
    }

    static onToggle(fn: (enabled: boolean) => void): () => void {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }

    static play(key: string, volume = 1): void {
        if (!this.isEnabled()) return;
        if (!this.scene) return;

        this.scene.sound.play(key, { volume });
    }
}
