import { LevelSystem } from "../systems/LevelSystem";
import { UIRoot } from "./UIRoot";
import { t } from "../i18n/index";

export class UI_LevelManager {
    private levelSystem = LevelSystem.getInstance();

    private container = document.getElementById("farm-level-hud")!;
    private levelText = document.getElementById("farm-level-text")!;
    private xpText = document.getElementById("farm-xp-text")!;
    private xpFill = document.getElementById("farm-xp-fill")!;

    private lastLevel: number;

    constructor() {
        this.container.classList.remove("hidden");

        this.lastLevel = this.levelSystem.getLevel();
        
        this.levelSystem.onChange(() => {
            this.render();
        });

        this.render();
    }

    private render() {
        const level = this.levelSystem.getLevel();
        const xp = this.levelSystem.getXp();
        const requiredXp = this.levelSystem.getXpRequiredForNextLevel();

        const percentage = Math.min(100, Math.floor((xp / requiredXp) * 100));

        if (level > this.lastLevel) {
            this.playLevelUpAnimation(level);
        }

        this.levelText.textContent = t("level.label").replace("{level}", String(level));
        this.xpText.textContent = `${xp} / ${requiredXp} XP`;
        this.xpFill.style.width = `${percentage}%`;

        this.lastLevel = level;
    }

    private playLevelUpAnimation(level: number) {
        this.container.classList.remove("level-up");

        void this.container.offsetWidth;

        this.container.classList.add("level-up");

        UIRoot.toast.success(t("level.up").replace("{level}", String(level)));

        setTimeout(() => {
            this.container.classList.remove("level-up");
        }, 900);
    }
}
