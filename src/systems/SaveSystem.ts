import type { GameSaveData } from "../types/SaveTypes";
import { InventorySystem } from "./InventorySystem";
import { StorageSystem } from "./StorageSystem";
import { MoneySystem } from "./MoneySystem";
import { LevelSystem } from "./LevelSystem";
import { EffectSystem } from "./EffectsSystem";
import { ToolSkinSystem } from "./ToolSkinSystem";

const SAVE_KEY = "greenvale_save";

export class SaveSystem {
    static save() {
        const data = this.getSaveData();

        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    }

    static load(): boolean {
        const raw = localStorage.getItem(SAVE_KEY);

        if (!raw) return false;

        try {
            const data = JSON.parse(raw) as GameSaveData;

            this.applySaveData(data);

            return true;
        } catch {
            console.error("Erro ao carregar save.");
            return false;
        }
    }

    static newGame() {
        this.delete();

        InventorySystem.getInstance().loadSaveData({
            slots: Array(28).fill(null),
            selectedSlot: 0,
        });

        StorageSystem.getInstance().loadSaveData({
            slots: Array(40).fill(null),
        });

        MoneySystem.getInstance().loadSaveData({
            coins: 100,
            bossTokens: 0,
        });

        LevelSystem.getInstance().loadSaveData({
            level: 1,
            xp: 0,
        });

        EffectSystem.getInstance().loadSaveData({
            active: [],
        });

        ToolSkinSystem.getInstance().reset();

        InventorySystem.getInstance().addStartingItems();

        this.save();
    }

    static delete() {
        localStorage.removeItem(SAVE_KEY);
    }

    static exportToJson(): string {
        return JSON.stringify(this.getSaveData(), null, 2);
    }

    static importFromJson(json: string): boolean {
        try {
            const data = JSON.parse(json) as GameSaveData;

            this.applySaveData(data);
            this.save();

            return true;
        } catch {
            console.error("Save inválido.");
            return false;
        }
    }

    static downloadSaveFile() {
        const json = this.exportToJson();

        const blob = new Blob([json], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "greenvale-save.json";
        a.click();

        URL.revokeObjectURL(url);
    }

    static async importSaveFile(file: File): Promise<boolean> {
        try {
            const json = await file.text();

            return this.importFromJson(json);
        } catch (error) {
            console.error("Erro a ler ficheiro:", error);
            return false;
        }
    }

    private static getSaveData(): GameSaveData {
        return {
            version: 1,

            inventory: InventorySystem.getInstance().getSaveData(),
            storage: StorageSystem.getInstance().getSaveData(),
            money: MoneySystem.getInstance().getSaveData(),
            level: LevelSystem.getInstance().getSaveData(),
            effects: EffectSystem.getInstance().getSaveData(),
            toolSkins: ToolSkinSystem.getInstance().getSaveData(),
        };
    }

    private static applySaveData(data: GameSaveData) {
        InventorySystem.getInstance().loadSaveData(data.inventory);
        StorageSystem.getInstance().loadSaveData(data.storage);
        MoneySystem.getInstance().loadSaveData(data.money);
        LevelSystem.getInstance().loadSaveData(data.level);
        EffectSystem.getInstance().loadSaveData(data.effects);
        if (data.toolSkins) {
            ToolSkinSystem.getInstance().loadSaveData(data.toolSkins);
        } else {
            ToolSkinSystem.getInstance().reset();
        }
    }
}
