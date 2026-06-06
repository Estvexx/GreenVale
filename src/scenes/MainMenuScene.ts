import Phaser from "phaser";
import menuHtml from "../html/main-menu.html?raw";
import { SettingsUI } from "../UI/UI_Settings";
import { SoundManager } from "../sounds/SoundsManager";
import { UIRoot } from "../UI/UIRoot";
import { SaveSystem } from "../systems/SaveSystem";

export class MainMenuScene extends Phaser.Scene {
    private menuElement?: HTMLElement;

    constructor() {
        super("MainMenuScene");
    }

    create() {
        const uiLayer = document.getElementById("ui-layer");
        if (!uiLayer) return;

        SoundManager.setScene(this);

        uiLayer.insertAdjacentHTML("afterbegin", menuHtml);
        this.menuElement = document.getElementById("main-menu") ?? undefined;

        new SettingsUI(this);

        document.getElementById("main-menu-play")!.onclick = () => {
            UIRoot.init();
            SaveSystem.load();
            SoundManager.play("click_sound");
            this.scene.start("FarmScene");
        };

        document.getElementById("main-menu-new-game")!.onclick = () => {
            UIRoot.init();
            SaveSystem.newGame();
            SoundManager.play("click_sound");
            this.scene.start("FarmScene");
        };

        document.getElementById("main-menu-upload")!.onchange = (event) => {
            const input = event.target as HTMLInputElement;
            const file = input.files?.[0];

            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const imported = SaveSystem.importJson(String(reader.result));

                if (imported) {
                    SoundManager.play("click_sound");
                } else {
                    SoundManager.play("error_sound");
                }
            };
            reader.readAsText(file);
        };

        document.getElementById("main-menu-exit")!.onclick = () => {
            SoundManager.play("click_sound");
            this.menuElement?.classList.add("main-menu--closed");
            this.game.loop.sleep();
        };

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.menuElement?.remove();
            this.menuElement = undefined;
        });
    }
}
