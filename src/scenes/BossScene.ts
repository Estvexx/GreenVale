import Phaser from "phaser";
import { Player } from "../entities/Player";
import { CameraManager } from "../camera/CameraManager";
import { MapManager } from "../map/MapManager";

export class BossScene extends Phaser.Scene {
    public player!: Player;

    private currentPortalId: string | null = null;
    private isInPortal = false;
    private tooltip = document.getElementById("zone-tooltip");

    constructor() {
        super("BossScene");
    }

    create() {
        const mapManager = new MapManager(this, "boss");
        const spawnPoint = mapManager.getSpawnPoint();

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
    }
}
