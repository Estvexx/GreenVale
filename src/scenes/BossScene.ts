import Phaser from "phaser";
import { Player } from "../entities/Player";
import { CameraManager } from "../camera/CameraManager";
import { MapManager } from "../map/MapManager";
import { Mob } from "../entities/Mob";
import { MOBS } from "../data/MobDatabase";
import { UI_ActiveEffectsManager } from "../UI/UI_ActiveEffectsManager";
import { UI_EffectShopManager } from "../UI/UI_EffectShopManager";
import { InventorySystem } from "../systems/InventorySystem";
import { UIInventoryManager } from "../UI/UI_InventoryManager";
import { UI_Inventory } from "../UI/UI_Inventory";
import { UI_HotBar } from "../UI/UI_Hotbar";
import { InputManager } from "../input/inputManager";
import { EffectSystem } from "../systems/EffectsSystem";

export class BossScene extends Phaser.Scene {
    public player!: Player;

    private currentPortalId: string | null = null;
    private isInPortal = false;
    private tooltip = document.getElementById("zone-tooltip");
    private mobs!: Phaser.Physics.Arcade.Group;
    private radialMenu!: UI_EffectShopManager;
    private effects = EffectSystem.getInstance();
    private inventory = InventorySystem.getInstance();

    constructor() {
        super("BossScene");
    }

    create() {
        const mapManager = new MapManager(this, "boss");
        const spawnPoint = mapManager.getSpawnPoint();

        new InputManager(this);
        new UI_HotBar();
        new UI_Inventory();
        new UIInventoryManager();
        this.radialMenu = new UI_EffectShopManager();
        new UI_ActiveEffectsManager();

        this.player = new Player(
            this,
            spawnPoint?.x ?? 128,
            spawnPoint?.y ?? 352,
        );

        new CameraManager(this, this.player, mapManager.map, "boss");

        mapManager.getCollisionObjects().forEach((obj) => {
            if (
                !obj.width ||
                !obj.height ||
                obj.width <= 0 ||
                obj.height <= 0
            ) {
                return;
            }

            const rect = this.add.rectangle(
                obj.x! + obj.width / 2,
                obj.y! + obj.height / 2,
                obj.width,
                obj.height,
            );

            this.physics.add.existing(rect, true);
            this.physics.add.collider(this.player, rect);
        });

        mapManager.getInteractables().forEach((obj) => {
            if (
                !obj.width ||
                !obj.height ||
                obj.width <= 0 ||
                obj.height <= 0
            ) {
                return;
            }

            const zone = this.add.zone(
                obj.x! + obj.width / 2,
                obj.y! + obj.height / 2,
                obj.width,
                obj.height,
            );

            this.physics.add.existing(zone, true);

            const type = obj.properties?.find(
                (p: any) => p.name === "type",
            )?.value;
            const portalId = obj.properties?.find(
                (p: any) => p.name === "portalId",
            )?.value;

            this.physics.add.overlap(this.player, zone, () => {
                if (type === "portal") {
                    this.currentPortalId = portalId ?? null;
                    this.isInPortal = true;
                }
            });
        });

        this.input.keyboard?.on("keydown-F", () => {
            if (this.currentPortalId === "farm") {
                this.scene.start("FarmScene");
            }
        });
        // =========== Spawn Mobs ============
        this.anims.create({
            key: "zombie_idle",
            frames: [
                { key: "zombie", frame: 0 },
                { key: "zombie", frame: 1 },
            ],
            frameRate: 3,
            repeat: -1,
        });

        this.anims.create({
            key: "slime_idle",
            frames: [
                { key: "slime", frame: 0 },
                { key: "slime", frame: 1 },
            ],
            frameRate: 3,
            repeat: -1,
        });

        this.anims.create({
            key: "bear_idle",
            frames: [
                { key: "bear", frame: 0 },
                { key: "bear", frame: 1 },
            ],
            frameRate: 3,
            repeat: -1,
        });

        this.mobs = this.physics.add.group();

        Object.values(MOBS).forEach((mobData) => {
            const spawn = mapManager.getBossSpawnByName(mobData.spawnName);

            if (!spawn) return;

            const mob = new Mob(
                this,
                spawn.x ?? 0,
                spawn.y ?? 0,
                mobData.texture,
                mobData.frame,
                mobData.hp,
                mobData.bossCoinDropChance,
                mobData.bossCoinBonusChance,
            );
            console.log(
                `Spawned mob: ${mobData.name} at (${spawn.x}, ${spawn.y})`,
            );
            if (mobData.texture === "zombie") {
                mob.play("zombie_idle");
            } else if (mobData.texture === "slime") {
                mob.play("slime_idle");
            } else if (mobData.texture === "bear") {
                mob.play("bear_idle");
            }
            mob.setInteractive();

            mob.on("pointerdown", () => {
                const item = this.inventory.getCurrentItem();

                if (!item) {
                    console.log("Não tens item na mão.");
                    return;
                }

                if (!item.damage) {
                    console.log("Este item não causa dano.");
                    return;
                }

                const damageMultiplier = this.effects.getDamageMultiplier();

                const finalDamage = Math.floor(item.damage * damageMultiplier);

                mob.takeDamage(finalDamage);

                console.log(`${item.name} causou ${item.damage} de dano`);
            });

            this.mobs.add(mob);
        });

        this.input.keyboard?.on("keydown-Q", () => {
            this.radialMenu.toggle();
        });
    }

    update(time: number) {
        this.player.update(time);

        if (this.tooltip) {
            this.tooltip.classList.toggle("hidden", !this.isInPortal);
        }

        if (!this.isInPortal) {
            this.currentPortalId = null;
        }

        this.isInPortal = false;

        this.effects.update();
    }
}
