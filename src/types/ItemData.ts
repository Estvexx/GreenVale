export interface Item {
    id: number;
    name: string;
    nameKey?: string;
    icon?: string;
    spritesheet?: string;
    col?: number;
    row?: number;
    maxStack: number;
    maxSlots?: number;
    description?: string;
    descriptionKey?: string;
    damage?: number;
    isSeed?: boolean;
    cropKey?: string;   // nome da pasta em assets/images/crops/
    growTime?: number;  // ms por stage de crescimento
    harvestId?: number; // ID do item colhido
}
