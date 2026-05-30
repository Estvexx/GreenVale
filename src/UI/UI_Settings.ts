import { FarmScene } from "../scenes/FarmScene.ts";

export class SettingsUI {
    private scene: FarmScene;
    private menu: HTMLElement;
    private container = document.getElementById("btnDefinicoes")!;

    constructor(scene: FarmScene) {
        this.container.classList.remove("hidden");
        this.scene = scene;
        this.menu = document.getElementById("settings-menu")!;

        this.init();
    }

    private init(): void {
        document.getElementById("btnDefinicoes")!.onclick = () => this.open();
        document.getElementById("close-settings")!.onclick = () => this.close();
        this.scene.input.keyboard?.on("keydown-ESC", () => this.close());

        document.getElementById("toggle-music")!.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            localStorage.setItem("musicEnabled", String(target.checked));

            if (target.checked) {
                if (!this.scene.bgMusic.isPlaying) {
                    this.scene.bgMusic.play();
                } else {
                    this.scene.bgMusic.resume();
                }
            } else {
                this.scene.bgMusic.pause();
            }
        };

        document.getElementById("toggle-sounds")!.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            localStorage.setItem("soundsEnabled", String(target.checked));
            this.scene.sound.mute = !target.checked;
        };

        document.querySelectorAll(".lang-btn").forEach((btn) => {
            btn.addEventListener("click", () =>
                this.setLang(btn as HTMLElement),
            );
        });

        document.querySelectorAll(".control-card").forEach((card) => {
            card.addEventListener("click", () =>
                this.setControlKeys(card as HTMLElement),
            );
        });

        document.querySelectorAll(".skin-card").forEach((card) => {
            card.addEventListener("click", () => {
                const skinKey = (card as HTMLElement).dataset.skin!;
                this.setSkin(card as HTMLElement, skinKey);
            });
        });

        document.addEventListener("fullscreenchange", () => {
            const checkbox = document.getElementById(
                "toggle-fullscreen",
            ) as HTMLInputElement;
            if (checkbox) {
                checkbox.checked = !!document.fullscreenElement;
            }
        });

        const fullscreenToggle = document.getElementById(
            "toggle-fullscreen",
        ) as HTMLInputElement;
        if (fullscreenToggle) {
            fullscreenToggle.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                if (target.checked) {
                    document.documentElement.requestFullscreen().catch(() => {
                        target.checked = false;
                    });
                } else {
                    document.exitFullscreen();
                }
            };
        }

        this.loadSavedState();
    }

    open(): void {
        this.menu.classList.remove("hidden");
        this.syncFullscreenToggle();
        this.scene.scene.pause();
    }

    close(): void {
        this.menu.classList.add("hidden");
        this.scene.player.applySkin();
        this.scene.player.controlScheme =
            localStorage.getItem("controlScheme") || "wasd";
        this.scene.scene.resume();
    }

    private setLang(btn: HTMLElement): void {
        document
            .querySelectorAll(".lang-btn")
            .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const lang = btn.dataset.lang!;
        import("../i18n/index.ts").then(({ setLanguage }) => {
            setLanguage(lang);
        });

        localStorage.setItem("language", lang);
    }

    private setControlKeys(card: HTMLElement): void {
        document
            .querySelectorAll(".control-card")
            .forEach((c) => c.classList.remove("active"));
        card.classList.add("active");

        const scheme = card.dataset.control!;
        localStorage.setItem("controlScheme", scheme);
    }

    private setSkin(card: HTMLElement, skinKey: string): void {
        document
            .querySelectorAll(".skin-card")
            .forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        localStorage.setItem("playerSkin", skinKey);
    }

    private syncFullscreenToggle(): void {
        const checkbox = document.getElementById(
            "toggle-fullscreen",
        ) as HTMLInputElement;
        if (checkbox) {
            checkbox.checked = !!document.fullscreenElement;
        }
    }

    private loadSavedState(): void {
        const savedLang = localStorage.getItem("language") || "pt";
        document.querySelectorAll(".lang-btn").forEach((btn) => {
            const lang = (btn as HTMLElement).dataset.lang;
            btn.classList.toggle("active", lang === savedLang);
        });

        const savedScheme = localStorage.getItem("controlScheme") || "wasd";
        document.querySelectorAll(".control-card").forEach((card) => {
            const scheme = (card as HTMLElement).dataset.control;
            card.classList.toggle("active", scheme === savedScheme);
        });

        const savedSkin = localStorage.getItem("playerSkin") || "skin_a";
        document.querySelectorAll(".skin-card").forEach((card) => {
            const skin = (card as HTMLElement).dataset.skin;
            card.classList.toggle("active", skin === savedSkin);
        });

        const musicEnabled = localStorage.getItem("musicEnabled") !== "false";
        (document.getElementById("toggle-music") as HTMLInputElement).checked =
            musicEnabled;

        const soundsEnabled = localStorage.getItem("soundsEnabled") !== "false";
        (document.getElementById("toggle-sounds") as HTMLInputElement).checked =
            soundsEnabled;
    }

    initMusic(): void {
        const musicEnabled = localStorage.getItem("musicEnabled") !== "false";
        if (musicEnabled) {
            this.scene.bgMusic.play();
        }
    }
}
