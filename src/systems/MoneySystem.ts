export class MoneySystem {
    private static instance: MoneySystem;
    private balance: number;
    private onChangeCallback: ((balance: number) => void) | null = null;

    private constructor() {
        this.balance = Number(localStorage.getItem("balance")) || 100;
        this.onChangeCallback?.(this.balance);
    }

    static getInstance(): MoneySystem {
        if (!MoneySystem.instance) {
            MoneySystem.instance = new MoneySystem();
        }
        return MoneySystem.instance;
    }

    onChange(callback: (balance: number) => void): void {
        this.onChangeCallback = callback;
    }

    getBalance(): number {
        return this.balance;
    }

    addMoney(amount: number): void {
        this.balance += amount;
        localStorage.setItem("balance", String(this.balance));
        this.onChangeCallback?.(this.balance);
    }

    spendMoney(amount: number): boolean {
        if (amount > this.balance) return false;
        this.balance -= amount;
        localStorage.setItem("balance", String(this.balance));
        this.onChangeCallback?.(this.balance);
        return true;
    }
}
