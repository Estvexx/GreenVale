export interface Item {
    id: number;
    name: string;
    icon?: string;
    spritesheet?: string;
    frame?: number;
    maxStack: number;
    maxSlots?: number;
    description?: string;
}
