import { UI_HotBar } from "./UI_Hotbar";
import { UI_Inventory } from "./UI_Inventory";
import { UIInventoryManager } from "./UI_InventoryManager";
import { UIMoneyManager } from "./UI_MoneyManager";
import { UI_LevelManager } from "./UI_LevelManager";
import { UI_EffectShopManager } from "./UI_EffectShopManager";
import { UI_ActiveEffectsManager } from "./UI_ActiveEffectsManager";

export class UIRoot {
    private static initialized = false;

    static effectShop: UI_EffectShopManager;

    static init() {
        if (this.initialized) return;

        new UI_HotBar();
        new UI_Inventory();
        new UIInventoryManager();
        new UIMoneyManager();
        new UI_LevelManager();

        this.effectShop = new UI_EffectShopManager();

        new UI_ActiveEffectsManager();

        this.initialized = true;
    }
}
