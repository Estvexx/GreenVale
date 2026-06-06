import type { Effect } from "../types/Effect";

type Listener = () => void;

export class EffectSystem {
    private static instance: EffectSystem;

    static getInstance(): EffectSystem {
        if (!this.instance) {
            this.instance = new EffectSystem();
        }

        return this.instance;
    }

    private effects: Effect[] = [];

    private listeners: Listener[] = [];

    onChange(cb: Listener) {
        this.listeners.push(cb);
    }

    private emitChange() {
        this.listeners.forEach((cb) => cb());
    }

    addEffect(effect: Effect) {
        const existing = this.effects.find((e) => e.id === effect.id);

        if (existing) {
            if (!effect.permanent) {
                existing.expiresAt = effect.expiresAt;
            }

            this.emitChange();
            return;
        }

        this.effects.push(effect);

        this.emitChange();
    }

    removeEffect(id: string) {
        this.effects = this.effects.filter((e) => e.id !== id);

        this.emitChange();
    }

    hasEffect(id: string): boolean {
        return this.effects.some((e) => e.id === id);
    }

    getEffect(id: string): Effect | undefined {
        return this.effects.find((e) => e.id === id);
    }

    // Aqui mostro na UI os efeitos ativos, os "..."cria um array copia
    getEffects(): Effect[] {
        return [...this.effects];
    }

    update() {
        const now = Date.now();

        const before = this.effects.length;

        this.effects = this.effects.filter((effect) => {
            if (effect.permanent) {
                return true;
            }

            return effect.expiresAt !== undefined && effect.expiresAt > now;
        });

        if (before !== this.effects.length) {
            this.emitChange();
        }
    }

    getRemainingSeconds(id: string): number {
        const effect = this.getEffect(id);

        if (!effect || effect.permanent || !effect.expiresAt) {
            return 0;
        }

        // Aqui calculo a diferenca em milissegundos e converto para segundos
        // Max nao deixa ser negativo e Math.floor arredonda para baixo
        return Math.max(0, Math.floor((effect.expiresAt - Date.now()) / 1000));
    }

    getSpeedMultiplier(): number {
        return this.hasEffect("speed") ? 2 : 1;
    }

    getDamageMultiplier(): number {
        return this.hasEffect("damage") ? 1.2 : 1;
    }

    // VASCO FAZ ISTO A TUA MANEIRA
    getGrowthMultiplier(): number {
        return this.hasEffect("growth") ? 1.25 : 1;
    }

    getSeedDiscountMultiplier(): number {
        return this.hasEffect("seed_discount") ? 0.85 : 1;
    }

    getSaveData() {
        return {
            active: [...this.effects],
        };
    }

    loadSaveData(data: { active: Effect[] }) {
        this.effects = [...data.active];

        this.update();
        this.emitChange();
    }
}
