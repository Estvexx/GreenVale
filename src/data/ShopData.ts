import { type Shop } from "../types/ShopTypes";

export const FERRAGENS_SHOP: Shop = {
    id: "ferragens",
    name: "Ferragens",
    items: [
        {
            id: 1,
            name: "Enxada",
            icon: "Enxada",
            price: 50,
            currency: "coins",
            amount: 1,
        },
        {
            id: 2,
            name: "Foice",
            icon: "foice",
            price: 75,
            currency: "coins",
            amount: 1,
        },
        {
            id: 3,
            name: "Balde de Água",
            icon: "balde_vazio",
            price: 75,
            currency: "coins",
            amount: 1,
        },
    ],
};

export const SEMENTES_SHOP: Shop = {
    id: "sementes",
    name: "Sementes",
    items: [
        {
            id: 10,
            price: 5,
            currency: "coins",
            amount: 5,
            icon: "seed",
            name: "Semente",
        },
    ],
};
