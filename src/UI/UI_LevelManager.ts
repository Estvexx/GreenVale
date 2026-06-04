import { LevelSystem } from "../systems/LevelSystem";

export class UI_LevelManager {
    private levelSystem = LevelSystem.getInstance();

    private levelText = document.getElementById("farm-level-text")!;
    private xpText = document.getElementById("farm-xp-text")!;
    private xpFill = document.getElementById("farm-xp-fill")!;

    constructor() {
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

        this.levelText.textContent = `Farm Lv. ${level}`;
        this.xpText.textContent = `${xp} / ${requiredXp} XP`;
        this.xpFill.style.width = `${percentage}%`;
    }
}
