export interface Item {
    id: number;
    name: string;
    icon: string;
    maxStack: number;
    maxSlots?: number;
    description?: string;
}
