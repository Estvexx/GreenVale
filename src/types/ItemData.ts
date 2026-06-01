export interface Item {
    id: number;
    name: string;
    icon?: string;
    spritesheet?: string;
    col?: number;
    row?: number;
    maxStack: number;
    maxSlots?: number;
    description?: string;
}
