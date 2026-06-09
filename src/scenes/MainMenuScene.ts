import Phaser from "phaser";
import menuHtml from "../html/main-menu.html?raw";
import { SettingsUI } from "../UI/UI_Settings";
import { SoundManager } from "../sounds/SoundsManager";
import { UIRoot } from "../UI/UIRoot";
import { SaveSystem } from "../systems/SaveSystem";
import { applyTranslations } from "../i18n";

const SPLASHES = [
    "Não é o Stardew Valley!",
    "100% livre de pesticidas!",
    "As cenouras são reais!",
    "O poço tem água?",
    "Rega e reza!",
    "Sem microtransações... por enquanto",
    "O boss não morde... muito",
    "Aprovado por agricultores virtuais!",
    "Feito com amor e bugs",
    "A colheita não vai a lado nenhum sozinha!",
    "O sol nasce para todos... às 07:00",
    "Já regaste hoje?",
    "Os zombies também precisam de amor",
    "Planta agora, chora depois",
    "A enxada é mais forte que a espada",
    "Nenhuma planta foi prejudicada",
    "Modo hardcore: sem balde de água",
    "Salva frequentemente. Confia em nós.",
    "A loja fecha às... nunca",
    "GreenVale™ não responsável por vício",
];

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

        const splash = document.getElementById("main-menu-splash");
        if (splash) splash.textContent = SPLASHES[Math.floor(Math.random() * SPLASHES.length)];

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
