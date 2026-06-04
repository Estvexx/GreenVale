import Phaser from "phaser";
import { Player } from "../entities/Player";
import { CameraManager } from "../camera/CameraManager";
import { MapManager } from "../map/MapManager";
import { Mob } from "../entities/Mob";
import { MOBS } from "../data/MobDatabase";
import { InventorySystem } from "../systems/InventorySystem";
import { InputManager } from "../input/inputManager";
import { EffectSystem } from "../systems/EffectsSystem";
import { UIRoot } from "../UI/UIRoot";
import { CollisionSystem } from "../systems/CollisionSystem";
import { InteractionZoneSystem } from "../systems/InteractionZoneSystem";
import { createMobAnimations } from "../animations/MobAnimations";

export class BossScene extends Phaser.Scene {
    public player!: Player;

    private tooltip = document.getElementById("zone-tooltip");
    private mobs!: Phaser.Physics.Arcade.Group;

    private effects = EffectSystem.getInstance();
    private inventory = InventorySystem.getInstance();

    private interactionZones!: InteractionZoneSystem;

    constructor() {
        super("BossScene");
    }

    create() {
        const mapManager = new MapManager(this, "boss");
        const spawnPoint = mapManager.getSpawnPoint();

        new InputManager(this, () => {
            this.handleInteraction();
        });

        this.player = new Player(
            this,
            spawnPoint?.x ?? 128,
            spawnPoint?.y ?? 352,
        );

        new CameraManager(this, this.player, mapManager.map, "boss");

        new CollisionSystem(this, this.player, mapManager);

        this.interactionZones = new InteractionZoneSystem(
            this,
            this.player,
            mapManager,
        );

        createMobAnimations(this);

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

            if (mobData.animKey) {
                mob.play(mobData.animKey);
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

                console.log(`${item.name} causou ${finalDamage} de dano`);
            });

            this.mobs.add(mob);
        });
    }

    update(time: number) {
        this.player.update(time);

        this.interactionZones.update();

        this.tooltip?.classList.toggle(
            "hidden",
            !this.interactionZones.isInsideZone(),
        );

        this.effects.update();
    }

    private handleInteraction() {
        const zone = this.interactionZones.getCurrentZone();

        if (!zone) return;

        if (zone.type === "portal" && zone.portalId === "farm") {
            this.scene.start("FarmScene");
        }
    }
}
