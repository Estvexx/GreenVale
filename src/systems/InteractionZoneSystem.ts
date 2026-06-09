import Phaser from "phaser";
import { Player } from "../entities/Player";
import { MapManager } from "../map/MapManager";

export type InteractionZone = {
    type: string;
    shopId?: string;
    portalId?: string;
};

export type ZoneEntry = InteractionZone & {
    bounds: Phaser.Geom.Rectangle;
};

export class InteractionZoneSystem {
    private player: Player;
    private zones: ZoneEntry[] = [];
    private currentZone: InteractionZone | null = null;

    constructor(_scene: Phaser.Scene, player: Player, mapManager: MapManager) {
        this.player = player;

        mapManager.getInteractables().forEach((obj) => {
            const type = this.getProperties(obj, "type");
            if (!type) return;

            this.zones.push({
                type,
                shopId: this.getProperties(obj, "shopId"),
                portalId: this.getProperties(obj, "portalId"),
                bounds: new Phaser.Geom.Rectangle(
                    obj.x!,
                    obj.y!,
                    obj.width!,
                    obj.height!,
                ),
            });
        });
    }

    update() {
        const px = this.player.x;
        const py = this.player.y;

        const found = this.zones.find(z => z.bounds.contains(px, py)) ?? null;

        // só atualiza se mudou, para não piscar
        if (found?.type !== this.currentZone?.type ||
            found?.shopId !== this.currentZone?.shopId ||
            found?.portalId !== this.currentZone?.portalId) {
            this.currentZone = found ? { type: found.type, shopId: found.shopId, portalId: found.portalId } : null;
        }
    }

    getCurrentZone() {
        return this.currentZone;
    }

    isInsideZone() {
        return this.currentZone !== null;
    }

    containsPoint(x: number, y: number): boolean {
        return this.zones.some(z => z.bounds.contains(x, y));
    }

    getZoneAt(x: number, y: number): ZoneEntry | null {
        return this.zones.find(z => z.bounds.contains(x, y)) ?? null;
    }

    private getProperties(
        obj: Phaser.Types.Tilemaps.TiledObject,
        name: string,
    ): string | undefined {
        return obj.properties?.find((p: any) => p.name === name)?.value;
    }
}
