import { MoneySystem } from "../systems/MoneySystem";

export class UIMoneyManager {
    private money = MoneySystem.getInstance();

    private coins = document.getElementById("coins")!;
    private boss = document.getElementById("bossTokens")!;

    constructor() {
        this.money.onChange((currency, value) => {
            this.update(currency, value);
        });
    }

    private update(currency: string, value: number) {
        if (currency === "coins") {
            this.coins.textContent = String(value);
        }

        if (currency === "bossTokens") {
            this.boss.textContent = String(value);
        }
    }
}
