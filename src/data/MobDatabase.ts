export type MobData = {
    spawnName: string;
    name: string;
    frame: number;
    texture: string;
    hp: number;

    bossCoinDropChance: number;
    bossCoinBonusChance: number;
    animKey: string;
};

export const MOBS: Record<string, MobData> = {
    zombie: {
        spawnName: "spawn1",
        name: "Zombie",
        frame: 0,
        texture: "zombie",
        animKey: "zombie_idle",
        hp: 50,
        bossCoinDropChance: 0.2,
        bossCoinBonusChance: 0.05,
    },
    bear: {
        spawnName: "spawn3",
        name: "Bear",
        frame: 0,
        texture: "bear",
        animKey: "bear_idle",
        hp: 500,
        bossCoinDropChance: 0.4,
        bossCoinBonusChance: 0.5,
    },
    slime: {
        spawnName: "spawn2",
        name: "Slime",
        frame: 0,
        texture: "slime",
        animKey: "slime_idle",
        hp: 1000,
        bossCoinDropChance: 0.6,
        bossCoinBonusChance: 0.6,
    },
};
