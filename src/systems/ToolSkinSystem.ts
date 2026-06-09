import { TOOL_SKINS } from "../data/ToolSkinDatabase";
import { MoneySystem } from "./MoneySystem";

type Listener = () => void;

export type BuyToolSkinResult =
    | "success"
    | "already_owned"
    | "no_money"
    | "invalid_skin";

const OWNED_KEY = "ownedToolSkins";
const ACTIVE_KEY = "activeToolSkins";

export class ToolSkinSystem {
    private static instance: ToolSkinSystem;

    private ownedSkins = new Set<string>();
    private activeSkins: Record<number, string> = {};
    private listeners: Listener[] = [];

    private constructor() {
        this.load();
    }

    static getInstance(): ToolSkinSystem {
        if (!this.instance) {
            this.instance = new ToolSkinSystem();
        }

        return this.instance;
    }

    buySkin(skinId: string): BuyToolSkinResult {
        const skin = TOOL_SKINS[skinId];

        if (!skin) return "invalid_skin";

        if (this.ownedSkins.has(skinId)) {
            this.selectSkin(skinId);
            return "already_owned";
        }

        const money = MoneySystem.getInstance();

        if (!money.spend("coins", skin.price)) {
            return "no_money";
        }

        this.ownedSkins.add(skinId);
        this.applySkin(skinId);

        this.save();
        this.notify();

        return "success";
    }

    selectSkin(skinId: string): boolean {
        const skin = TOOL_SKINS[skinId];

        if (!skin) return false;
        if (!this.ownedSkins.has(skinId)) return false;

        this.applySkin(skinId);

        this.save();
        this.notify();

        return true;
    }

    getSkinForItem(itemId: number) {
        const skinId = this.activeSkins[itemId];

        if (!skinId) return null;

        return TOOL_SKINS[skinId] ?? null;
    }

    getAllSkins() {
        return Object.values(TOOL_SKINS);
    }

    isOwned(skinId: string): boolean {
        return this.ownedSkins.has(skinId);
    }

    onChange(callback: Listener) {
        this.listeners.push(callback);
    }

    private applySkin(skinId: string) {
        const skin = TOOL_SKINS[skinId];

        skin.targetItemIds.forEach((itemId) => {
            this.activeSkins[itemId] = skinId;
        });
    }

    private notify() {
        this.listeners.forEach((callback) => callback());
    }

    private save() {
        localStorage.setItem(OWNED_KEY, JSON.stringify([...this.ownedSkins]));
        localStorage.setItem(ACTIVE_KEY, JSON.stringify(this.activeSkins));
    }

    private load() {
        const owned = localStorage.getItem(OWNED_KEY);

        if (owned) {
            try {
                this.ownedSkins = new Set(JSON.parse(owned));
            } catch {
                this.ownedSkins = new Set();
            }
        }

        const active = localStorage.getItem(ACTIVE_KEY);

        if (active) {
            try {
                this.activeSkins = JSON.parse(active);
            } catch {
                this.activeSkins = {};
            }
        }
    }
}
