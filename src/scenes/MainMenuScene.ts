import Phaser from "phaser";
import menuHtml from "../html/main-menu.html?raw";
import { SettingsUI } from "../UI/UI_Settings";
import { SoundManager } from "../sounds/SoundsManager";
import { UIRoot } from "../UI/UIRoot";

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
            SoundManager.play("click_sound");
            this.scene.start("FarmScene");
        };

        document.getElementById("main-menu-upload")!.onchange = (event) => {
            const input = event.target as HTMLInputElement;
            const file = input.files?.[0];

            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    JSON.parse(String(reader.result));
                    localStorage.setItem(
                        "uploadedSaveJson",
                        String(reader.result),
                    );
                    SoundManager.play("click_sound");
                } catch {
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

