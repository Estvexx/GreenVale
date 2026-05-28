class UIManager {
    inventory: HTMLElement;

    constructor() {
        this.inventory = document.getElementById("inventory")!;
    }

    openInventory() {
        this.inventory.classList.remove("hidden");
    }

    closeInventory() {
        this.inventory.classList.add("hidden");
    }

    toggleInventory() {
        this.inventory.classList.toggle("hidden");
    }
}
