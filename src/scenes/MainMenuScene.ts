import Phaser from "phaser";
import menuHtml from "../html/main-menu.html?raw";
import { SettingsUI } from "../UI/UI_Settings";
import { SoundManager } from "../sounds/SoundsManager";
import { UIRoot } from "../UI/UIRoot";
import { SaveSystem } from "../systems/SaveSystem";
import { applyTranslations } from "../i18n";

export class MainMenuScene extends Phaser.Scene {
    private menuElement?: HTMLElement;
    private importInput?: HTMLInputElement;

    constructor() {
        super("MainMenuScene");
    }

    create() {
        const uiLayer = document.getElementById("ui-layer");
        if (!uiLayer) return;

        this.scene.launch("MenuBackgroundScene");
        this.scene.sendToBack("MenuBackgroundScene");

        SoundManager.setScene(this);

        uiLayer.insertAdjacentHTML("afterbegin", menuHtml);
        applyTranslations();
        this.menuElement = document.getElementById("main-menu") ?? undefined;
        this.importInput =
            (document.getElementById(
                "main-menu-import-input",
            ) as HTMLInputElement | null) ?? undefined;

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

        document.getElementById("main-menu-import")!.onclick = () => {
            this.importInput?.click();
        };

        this.importInput?.addEventListener("change", async (event) => {
            const input = event.target as HTMLInputElement;
            const file = input.files?.[0];

            if (!file) return;

            const imported = await SaveSystem.importSaveFile(file);

            SoundManager.play(imported ? "click_sound" : "error_sound");
            input.value = "";
        });

        document.getElementById("main-menu-exit")!.onclick = () => {
            SoundManager.play("click_sound");
            this.menuElement?.classList.add("main-menu--closed");
            this.game.loop.sleep();
        };

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scene.stop("MenuBackgroundScene");
            this.menuElement?.remove();
            this.menuElement = undefined;
        });
    }
}
