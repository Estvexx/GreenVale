import Phaser from "phaser";
import { Player } from "../entities/Player";
import { CameraManager } from "../camera/CameraManager";
import { MapManager } from "../map/MapManager";
import { Mob } from "../entities/Mob";
import { MOBS } from "../data/MobDatabase";
import { InventorySystem } from "../systems/InventorySystem";
import { InputManager } from "../input/inputManager";
import { EffectSystem } from "../systems/EffectsSystem";
import { CollisionSystem } from "../systems/CollisionSystem";
import { InteractionZoneSystem } from "../systems/InteractionZoneSystem";
import { createMobAnimations } from "../animations/MobAnimations";
import { BossEnvironmentFX } from "../camera/BossEnvironmentFX";
import { MusicManager } from "../sounds/MusicManager";
import { SoundManager } from "../sounds/SoundsManager";
import { UIRoot } from "../UI/UIRoot";
import { t } from "../i18n";
import { TimeSystem } from "../systems/TimeSystem";

export class BossScene extends Phaser.Scene {
    public player!: Player;
    private fireSound?: Phaser.Sound.BaseSound;
    public environmentFX!: BossEnvironmentFX;

    private tooltip = document.getElementById("zone-tooltip");
    private mobs!: Phaser.Physics.Arcade.Group;

    private effects = EffectSystem.getInstance();
    private inventory = InventorySystem.getInstance();
    private timeSystem = TimeSystem.getInstance();

    private interactionZones!: InteractionZoneSystem;

    constructor() {
        super("BossScene");
    }

    create() {
        const mapManager = new MapManager(this, "boss");
        const spawnPoint = mapManager.getSpawnPoint();

        MusicManager.play(this, "bossscene_music", 0.3);
        this.fireSound = this.sound.add("fire_sound", {
            loop: true,
            volume: 0.8,
        });

        this.fireSound.play();
        SoundManager.setScene(this);

        new InputManager(this, () => {
            this.handleInteraction();
        });

        this.player = new Player(
            this,
            spawnPoint?.x ?? 128,
            spawnPoint?.y ?? 352,
        );

        new CameraManager(this, this.player, mapManager.map, "boss");
        this.environmentFX = new BossEnvironmentFX(this);

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
                    UIRoot.toast.error(t("combat.noItemInHand"));
                    SoundManager.play("error_sound");
                    return;
                }

                if (!item.damage) {
                    UIRoot.toast.error(t("combat.itemHasNoDamage"));
                    SoundManager.play("error_sound");
                    return;
                }

                const damageMultiplier = this.effects.getDamageMultiplier();
                const finalDamage = Math.floor(item.damage * damageMultiplier);

                mob.takeDamage(finalDamage);
                SoundManager.play("punch_sound");
            });

            this.mobs.add(mob);
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.fireSound?.stop();
            this.fireSound?.destroy();
            this.fireSound = undefined;
        });
    }

    update(time: number, delta: number) {
        this.player.update(time);

        this.timeSystem.update(delta);

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
