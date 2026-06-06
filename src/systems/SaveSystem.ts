import type { GameSaveData } from "../types/SaveTypes";
import { InventorySystem } from "./InventorySystem";
import { StorageSystem } from "./StorageSystem";
import { MoneySystem } from "./MoneySystem";
import { LevelSystem } from "./LevelSystem";
import { EffectSystem } from "./EffectsSystem";

const SAVE_KEY = "greenvale_save";

export class SaveSystem {
    static newGame() {
        this.delete();
        this.loadSaveData({
            version: 1,
            inventory: {
                slots: Array(28).fill(null),
                selectedSlot: 0,
            },
            storage: {
                slots: Array(40).fill(null),
            },
            money: {
                coins: 100,
                bossTokens: 0,
            },
            level: {
                level: 1,
                xp: 0,
            },
            effects: {
                active: [],
            },
        });
    }

    static save() {
        const data: GameSaveData = {
            version: 1,

            inventory: InventorySystem.getInstance().getSaveData(),
            storage: StorageSystem.getInstance().getSaveData(),
            money: MoneySystem.getInstance().getSaveData(),
            level: LevelSystem.getInstance().getSaveData(),
            effects: EffectSystem.getInstance().getSaveData(),
        };

        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    }

    static load(): boolean {
        const raw = localStorage.getItem(SAVE_KEY);

        if (!raw) return false;

        try {
            const data = JSON.parse(raw) as GameSaveData;

            this.loadSaveData(data);

            return true;
        } catch (error) {
            console.error("Erro ao carregar save:", error);
            return false;
        }
    }

    static importJson(raw: string): boolean {
        try {
            const data = JSON.parse(raw) as GameSaveData;

            this.loadSaveData(data);
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));

            return true;
        } catch (error) {
            console.error("Erro ao importar save:", error);
            return false;
        }
    }

    private static loadSaveData(data: GameSaveData) {
        InventorySystem.getInstance().loadSaveData(data.inventory);
        StorageSystem.getInstance().loadSaveData(data.storage);
        MoneySystem.getInstance().loadSaveData(data.money);
        LevelSystem.getInstance().loadSaveData(data.level);
        EffectSystem.getInstance().loadSaveData(data.effects);
    }

    static delete() {
        localStorage.removeItem(SAVE_KEY);
    }

    static exists(): boolean {
        return localStorage.getItem(SAVE_KEY) !== null;
    }
}
