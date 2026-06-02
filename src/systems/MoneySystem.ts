type Currency = "coins" | "bossTokens";

type Listener = (currency: Currency, value: number) => void;

export class MoneySystem {
    private static instance: MoneySystem;

    private values: Record<Currency, number> = {
        coins: 100,
        bossTokens: 0,
    };

    private listeners: Listener[] = [];

    private constructor() {
        const savedCoins = Number(localStorage.getItem("coins")) || 100;
        const savedBoss = Number(localStorage.getItem("bossTokens")) || 0;

        this.values.coins = savedCoins;
        this.values.bossTokens = savedBoss;
    }

    static getInstance(): MoneySystem {
        if (!MoneySystem.instance) {
            MoneySystem.instance = new MoneySystem();
        }
        return MoneySystem.instance;
    }

    onChange(callback: Listener): void {
        this.listeners.push(callback);

        callback("coins", this.values.coins);
        callback("bossTokens", this.values.bossTokens);
    }

    private emit(currency: Currency) {
        this.listeners.forEach((cb) => {
            cb(currency, this.values[currency]);
        });
    }

    get(currency: Currency): number {
        return this.values[currency];
    }

    add(currency: Currency, amount: number): void {
        this.values[currency] += amount;

        localStorage.setItem(currency, String(this.values[currency]));

        this.emit(currency);
    }

    // Currency é o tipo de moeda que estou a utilizar
    spend(currency: Currency, amount: number): boolean {
        if (this.values[currency] < amount) return false;

        this.values[currency] -= amount;

        localStorage.setItem(currency, String(this.values[currency]));

        this.emit(currency);

        return true;
    }
}
