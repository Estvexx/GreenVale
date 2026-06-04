export type Currency = "coins" | "bossTokens";

type Listener = (currency: Currency, value: number) => void;

export class MoneySystem {
    private static instance: MoneySystem;

    private coins: number;
    private bossTokens: number;

    private listeners: Listener[] = [];

    private constructor() {
        this.coins = this.load("coins", 100);
        this.bossTokens = this.load("bossTokens", 0);
    }

    static getInstance(): MoneySystem {
        if (!MoneySystem.instance) {
            MoneySystem.instance = new MoneySystem();
        }

        return MoneySystem.instance;
    }

    onChange(callback: Listener): void {
        this.listeners.push(callback);

        callback("coins", this.coins);
        callback("bossTokens", this.bossTokens);
    }

    get(currency: Currency): number {
        if (currency === "coins") return this.coins;

        return this.bossTokens;
    }

    add(currency: Currency, amount: number): void {
        if (amount <= 0) return;

        const current = this.get(currency);
        const next = current + amount;

        this.set(currency, next);
    }

    spend(currency: Currency, amount: number): boolean {
        if (amount <= 0) return false;

        const current = this.get(currency);

        if (current < amount) return false;

        this.set(currency, current - amount);

        return true;
    }

    private set(currency: Currency, value: number): void {
        if (currency === "coins") {
            this.coins = value;
        } else {
            this.bossTokens = value;
        }

        localStorage.setItem(currency, String(value));

        this.notify(currency);
    }

    private notify(currency: Currency): void {
        const value = this.get(currency);

        this.listeners.forEach((callback) => {
            callback(currency, value);
        });
    }

    private load(key: Currency, defaultValue: number): number {
        const saved = localStorage.getItem(key);

        if (saved === null) return defaultValue;

        return Number(saved);
    }
}
