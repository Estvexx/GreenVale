import Phaser from "phaser";
import { SHOP_DATA, type ShopType } from "./ShopData";
import { ShopService } from "./ShopService";
import { InventorySystem } from "../systems/InventorySystem";

// TODO: substituir por object layer do Tiled
const SHOP_ZONES: Record<ShopType, { x: number; y: number; radius: number }> = {
    ferragens: { x: 300, y: 460, radius: 100 },
    sementes: { x: 500, y: 300, radius: 100 },
    mercado: { x: 700, y: 300, radius: 100 },
};

export class ShopManager {
    //private scene: Phaser.Scene;
    private promptText!: Phaser.GameObjects.Text;
    private currentShop: ShopType | null = null;
    private inventory = InventorySystem.getInstance();

    constructor(scene: Phaser.Scene) {
        //this.scene = scene;

        const service = new ShopService();

        this.promptText = scene.add
            .text(0, 0, "Pressiona E para entrar", {
                fontSize: "14px",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: { x: 8, y: 4 },
            })
            .setDepth(50)
            .setVisible(false);

        scene.input.keyboard!.on("keydown-E", () => {
            if (this.currentShop) this.openShop(this.currentShop);
        });

        (window as any).buyItem = (id: string, shopType: ShopType) => {
            const success = service.buy(id, shopType);
            if (!success) console.warn("Saldo insuficiente!");
        };

        (window as any).sellItem = (id: string, price: number) => {
            service.sell(id, price);
        };

        // Quando atualizo o inventário atualizado o estado da loja
        this.inventory.onChange(() => this.syncShopState());
    }

    update(playerX: number, playerY: number) {
        this.currentShop = null;
        for (const type in SHOP_ZONES) {
            const zone = SHOP_ZONES[type as ShopType];

            const dist = Phaser.Math.Distance.Between(
                playerX,
                playerY,
                zone.x,
                zone.y,
            );

            if (dist <= zone.radius) {
                this.currentShop = type as ShopType;
                this.promptText
                    .setPosition(playerX + 40, playerY - 20)
                    .setVisible(true);
                return;
            }
        }

        this.promptText.setVisible(false);
    }

    private openShop(type: ShopType) {
        SHOP_DATA[type].forEach((shopItem) => {
            const inventoryItem = this.inventory.slots.find(
                (s) => s?.id === shopItem.id,
            );
            shopItem.isActive =
                !inventoryItem || inventoryItem.quantity < shopItem.maxStack;
        });

        document.getElementById(`shop-${type}`)?.classList.remove("hidden");
        (window as any).openShop(type);
        // this.scene.scene.pause("FarmScene");
    }

    private syncShopState(): void {
        console.log("DEBUG: Sincronizando estado da loja com inventário...");
        for (const shopType in SHOP_DATA) {
            SHOP_DATA[shopType as ShopType].forEach((shopItem) => {
                const existing = this.inventory.slots.find(
                    (s) => s?.id === shopItem.id,
                );
                shopItem.isActive =
                    (existing?.quantity ?? 0) < shopItem.maxStack;
            });

            const grid = document.getElementById(`grid-${shopType}`);
            if (grid && grid.innerHTML !== "") {
                (window as any).openShop(shopType);
            }
        }
    }
}
