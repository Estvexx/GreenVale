import { TOOL_SKINS } from "../ToolSkinDatabase";
import { type Shop } from "../../types/ShopTypes";

export const UPGRADES_SHOP: Shop = {
    id: "upgrades",
    name: "Skins",
    mode: "buy",
    items: Object.values(TOOL_SKINS).map((skin) => ({
        skinId: skin.id,
        price: skin.price,
        currency: "coins",
        amount: 1,
    })),
};
