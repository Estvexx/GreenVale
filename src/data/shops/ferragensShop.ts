import { type Shop } from "../../types/ShopTypes";

export const FERRAGENS_SHOP: Shop = {
    id: "ferragens",
    name: "Ferragens",
    items: [
        {
            id: 1,
            name: "Enxada",
            icon: "hoe",
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
