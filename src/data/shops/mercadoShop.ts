import { type Shop } from "../../types/ShopTypes";

export const MERCADO_SHOP: Shop = {
    id: "mercado",
    name: "Mercado",
    nameKey: "shop.names.vendas",
    mode: "sell",
    items: [
        {
            id: 20,
            price: 70,
            currency: "coins",
            amount: 1,
        },
        {
            id: 21,
            price: 90,
            currency: "coins",
            amount: 1,
        },
        {
            id: 22,
            price: 130,
            currency: "coins",
            amount: 1,
        },
        {
            id: 23,
            price: 100,
            currency: "coins",
            amount: 1,
        },
        {
            id: 24,
            price: 160,
            currency: "coins",
            amount: 1,
        },
        {
            id: 25,
            price: 55,
            currency: "coins",
            amount: 1,
        },
    ],
};
