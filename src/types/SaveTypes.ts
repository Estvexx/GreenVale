import type { InventorySlot } from "./InventoryTypes";
import type { Effect } from "./Effect";

export type ToolSkinSaveData = {
    owned: string[];
    active: Record<number, string>;
};

export type CropSaveData = {
    x: number;
    y: number;
    seedId: number;
    stage: number;
    watered: boolean;
    grownAt: number;
};

export type FarmingSaveData = {
    crops: CropSaveData[];
};

export type TimeSaveData = {
    day: number;
    minutes: number;
};

export type GameSaveData = {
    version: number;

    inventory: {
        slots: InventorySlot[];
        selectedSlot: number;
    };

    storage: {
        slots: InventorySlot[];
    };

    money: {
        coins: number;
        bossTokens: number;
    };

    level: {
        level: number;
        xp: number;
    };

    effects: {
        active: Effect[];
    };

    toolSkins?: ToolSkinSaveData;
    farming?: FarmingSaveData;
    time?: TimeSaveData;
};
