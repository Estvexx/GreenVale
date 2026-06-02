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

        return Math.max(0, Math.floor((effect.expiresAt - Date.now()) / 1000));
    }
}
