import type { EffectType } from "./EffectType";

export type Effect = {
    id: EffectType;

    name: string;

    description: string;

    icon: string;

    permanent: boolean;

    expiresAt?: number;
};
