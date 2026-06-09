import Phaser from "phaser";
import { MusicManager } from "../sounds/MusicManager.ts";
import { SoundManager } from "../sounds/SoundsManager.ts";
import { setLanguage } from "../i18n/index.ts";
import type { Player } from "../entities/Player.ts";

type SettingsScene = Phaser.Scene & {
    player?: Player;
};

export class SettingsUI {
    private scene: SettingsScene;

    private container = document.getElementById("btnDefinicoes")!;
    private menu = document.getElementById("settings-menu")!;

    private closeButton = document.getElementById("close-settings")!;
    private musicToggle = document.getElementById(
        "toggle-music",
    ) as HTMLInputElement;
    private soundsToggle = document.getElementById(
        "toggle-sounds",
    ) as HTMLInputElement;
    private fullscreenToggle = document.getElementById(
        "toggle-fullscreen",
    ) as HTMLInputElement;
    private clickMoveToggle = document.getElementById(
        "toggle-click-move",
    ) as HTMLInputElement;

    private langButtons = document.querySelectorAll<HTMLElement>(".lang-btn");
    private controlCards =
        document.querySelectorAll<HTMLElement>(".control-card");
    private skinCards = document.querySelectorAll<HTMLElement>(".skin-card");

    constructor(scene: SettingsScene) {
        this.scene = scene;

        this.container.classList.remove("hidden");

        this.init();

        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.destroy();
        });
    }

    private init(): void {
        this.container.onclick = () => this.open();
        this.closeButton.onclick = () => this.close();

        this.musicToggle.onchange = () => {
            localStorage.setItem(
                "musicEnabled",
                String(this.musicToggle.checked),
            );

            if (this.musicToggle.checked) {
                MusicManager.resume();
            } else {
                MusicManager.pause();
            }
        };

        this.soundsToggle.onchange = () => {
            SoundManager.setEnabled(this.soundsToggle.checked);
        };

        this.clickMoveToggle.onchange = () => {
            localStorage.setItem("clickMoveEnabled", String(this.clickMoveToggle.checked));
        };

        this.fullscreenToggle.onchange = () => {
            if (this.fullscreenToggle.checked) {
                document.documentElement.requestFullscreen().catch(() => {
                    this.fullscreenToggle.checked = false;
                });
            } else {
                document.exitFullscreen();
            }
        };

        document.addEventListener("fullscreenchange", this.onFullscreenChange);

        this.langButtons.forEach((btn) => {
            btn.onclick = () => this.setLang(btn);
        });

        this.controlCards.forEach((card) => {
            card.onclick = () => this.setControlKeys(card);
        });

        this.skinCards.forEach((card) => {
            card.onclick = () => {
                const skinKey = card.dataset.skin!;
                this.setSkin(card, skinKey);
            };
        });

        this.loadSavedState();
    }

    open(): void {
        SoundManager.play("click_sound");
        this.menu.classList.remove("hidden");
        this.syncFullscreenToggle();
        this.scene.scene.pause();
    }

    close(): void {
        SoundManager.play("click_sound");
        this.menu.classList.add("hidden");

        if (this.scene.player) {
            this.scene.player.applySkin();
            this.scene.player.controlScheme =
                localStorage.getItem("controlScheme") || "wasd";
        }

        this.scene.scene.resume();
    }

    private setLang(btn: HTMLElement): void {
        SoundManager.play("click_sound");

        this.langButtons.forEach((b) => {
            b.classList.remove("active");
        });

        btn.classList.add("active");

        const lang = btn.dataset.lang!;

        setLanguage(lang);
        localStorage.setItem("language", lang);
    }

    private setControlKeys(card: HTMLElement): void {
        SoundManager.play("click_sound");

        this.controlCards.forEach((c) => {
            c.classList.remove("active");
        });

        card.classList.add("active");

        const scheme = card.dataset.control!;
        localStorage.setItem("controlScheme", scheme);
    }

    private setSkin(card: HTMLElement, skinKey: string): void {
        SoundManager.play("click_sound");

        this.skinCards.forEach((c) => {
            c.classList.remove("active");
        });

        card.classList.add("active");

        localStorage.setItem("playerSkin", skinKey);
    }

    private syncFullscreenToggle(): void {
        this.fullscreenToggle.checked = !!document.fullscreenElement;
    }

    private onFullscreenChange = () => {
        this.syncFullscreenToggle();
    };

    private loadSavedState(): void {
        const savedLang = localStorage.getItem("language") || "pt";

        this.langButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.lang === savedLang);
        });

        const savedScheme = localStorage.getItem("controlScheme") || "wasd";

        this.controlCards.forEach((card) => {
            card.classList.toggle(
                "active",
                card.dataset.control === savedScheme,
            );
        });

        const savedSkin = localStorage.getItem("playerSkin") || "skin_a";

        this.skinCards.forEach((card) => {
            card.classList.toggle("active", card.dataset.skin === savedSkin);
        });

        const musicEnabled = localStorage.getItem("musicEnabled") !== "false";
        this.musicToggle.checked = musicEnabled;

        const soundsEnabled = localStorage.getItem("soundsEnabled") !== "false";
        this.soundsToggle.checked = soundsEnabled;

        const clickMoveEnabled = localStorage.getItem("clickMoveEnabled") !== "false";
        this.clickMoveToggle.checked = clickMoveEnabled;

        this.syncFullscreenToggle();
    }

    private destroy(): void {
        this.container.onclick = null;
        this.closeButton.onclick = null;

        this.musicToggle.onchange = null;
        this.soundsToggle.onchange = null;
        this.fullscreenToggle.onchange = null;

        this.langButtons.forEach((btn) => {
            btn.onclick = null;
        });

        this.controlCards.forEach((card) => {
            card.onclick = null;
        });

        this.skinCards.forEach((card) => {
            card.onclick = null;
        });

        document.removeEventListener(
            "fullscreenchange",
            this.onFullscreenChange,
        );

        this.menu.classList.add("hidden");
        this.container.classList.add("hidden");
    }
}
