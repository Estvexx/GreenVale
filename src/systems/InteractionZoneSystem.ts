import Phaser from "phaser";
import { Player } from "../entities/Player";
import { MapManager } from "../map/MapManager";

export type InteractionZone = {
    type: string;
    shopId?: string;
    portalId?: string;
};

export class InteractionZoneSystem {
    private scene: Phaser.Scene;
    private player: Player;
    private mapManager: MapManager;

    private currentZone: InteractionZone | null = null;
    private touchedThisFrame = false;

    constructor(scene: Phaser.Scene, player: Player, mapManager: MapManager) {
        this.scene = scene;
        this.player = player;
        this.mapManager = mapManager;

        this.createZones();
    }

    private createZones() {
        this.mapManager.getInteractables().forEach((obj) => {
            const zone = this.scene.add.zone(
                obj.x! + obj.width! / 2,
                obj.y! + obj.height! / 2,
                obj.width!,
                obj.height!,
            );

            this.scene.physics.add.existing(zone, true);

            const type = this.getProp(obj, "type");
            const shopId = this.getProp(obj, "shopId");
            const portalId = this.getProp(obj, "portalId");

            this.scene.physics.add.overlap(this.player, zone, () => {
                if (!type) return;

                this.currentZone = {
                    type,
                    shopId,
                    portalId,
                };

                this.touchedThisFrame = true;
            });
        });
    }

    update() {
        if (!this.touchedThisFrame) {
            this.currentZone = null;
        }

        this.touchedThisFrame = false;
    }

    getCurrentZone() {
        return this.currentZone;
    }

    isInsideZone() {
        return this.currentZone !== null;
    }

    private getProp(
        obj: Phaser.Types.Tilemaps.TiledObject,
        name: string,
    ): string | undefined {
        return obj.properties?.find((p: any) => p.name === name)?.value;
    }
}
