import { UI_HotBar } from "./UI_Hotbar";
import { UI_Inventory } from "./UI_Inventory";
import { UIInventoryManager } from "./UI_InventoryManager";
import { UIMoneyManager } from "./UI_MoneyManager";
import { UI_LevelManager } from "./UI_LevelManager";
import { UI_EffectShopManager } from "./UI_EffectShopManager";
import { UI_ActiveEffectsManager } from "./UI_ActiveEffectsManager";
import { UI_ShopManager } from "./UI_ShopManager";
import { UI_StorageManager } from "./UI_StorageManager";

export class UIRoot {
    private static initialized = false;

    static effectShop: UI_EffectShopManager;
    static shop: UI_ShopManager;
    static storage: UI_StorageManager;

    static init() {
        if (this.initialized) return;

        new UI_HotBar();
        new UI_Inventory();
        new UIInventoryManager();
        new UIMoneyManager();
        new UI_LevelManager();

        this.shop = new UI_ShopManager();
        this.storage = new UI_StorageManager();
        this.effectShop = new UI_EffectShopManager();

        new UI_ActiveEffectsManager();

        this.initialized = true;
    }
}
