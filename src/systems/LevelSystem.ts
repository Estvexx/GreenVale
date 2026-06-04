type Listener = () => void;

export class LevelSystem {
    private static instance: LevelSystem;

    static getInstance(): LevelSystem {
        if (!this.instance) {
            this.instance = new LevelSystem();
        }

        return this.instance;
    }

    private level = 1;
    private xp = 0;

    private listeners: Listener[] = [];

    private constructor() {
        this.level = Number(localStorage.getItem("farmLevel")) || 1;
        this.xp = Number(localStorage.getItem("farmXp")) || 0;
    }

    onChange(cb: Listener) {
        this.listeners.push(cb);
    }

    private emitChange() {
        this.listeners.forEach((cb) => cb());
    }

    getLevel(): number {
        return this.level;
    }

    getXp(): number {
        return this.xp;
    }

    getXpRequiredForNextLevel(): number {
        return this.level * 100;
    }

    addXp(amount: number) {
        this.xp += amount;

        while (this.xp >= this.getXpRequiredForNextLevel()) {
            this.xp -= this.getXpRequiredForNextLevel();
            this.level++;
        }

        this.save();
        this.emitChange();
    }

    isUnlocked(requiredLevel: number): boolean {
        return this.level >= requiredLevel;
    }

    private save() {
        localStorage.setItem("farmLevel", String(this.level));
        localStorage.setItem("farmXp", String(this.xp));
    }
}
