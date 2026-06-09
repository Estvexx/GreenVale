import { UI_HotBar } from "./UI_Hotbar";
import { UI_Inventory } from "./UI_Inventory";
import { UIInventoryManager } from "./UI_InventoryManager";
import { UIMoneyManager } from "./UI_MoneyManager";
import { UI_LevelManager } from "./UI_LevelManager";
import { UI_EffectShopManager } from "./UI_EffectShopManager";
import { UI_ActiveEffectsManager } from "./UI_ActiveEffectsManager";
import { UI_ShopManager } from "./UI_ShopManager";
import { UI_StorageManager } from "./UI_StorageManager";
import { UI_ToastManager } from "./UI_ToastManager";
import { UI_TimeManager } from "./UI_TimeManager";
import { UI_SeedPicker } from "./UI_SeedPicker";
import { UI_GrowthSpeed } from "./UI_GrowthSpeed";
import { UI_ManualManager } from "./UI_ManualManager";

export class UIRoot {
    private static initialized = false;

    static effectShop: UI_EffectShopManager;
    static shop: UI_ShopManager;
    static storage: UI_StorageManager;
    static toast: UI_ToastManager;
    static seedPicker: UI_SeedPicker;

    static reset() {
        this.initialized = false;
    }

    static closeTopmost(): boolean {
        if (this.seedPicker?.isVisible())  { this.seedPicker.close();  return true; }
        if (this.shop?.isVisible())        { this.shop.close();        return true; }
        if (this.storage?.isVisible())     { this.storage.close();     return true; }
        if (this.effectShop?.isVisible())  { this.effectShop.close();  return true; }
        return false;
    }

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
        this.toast = new UI_ToastManager();
        new UI_TimeManager();

        new UI_ActiveEffectsManager();
        this.seedPicker = new UI_SeedPicker();
        new UI_GrowthSpeed();
        new UI_ManualManager();

        this.initialized = true;
    }
}
