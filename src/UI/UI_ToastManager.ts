export type ToastType = "success" | "error" | "info";

export class UI_ToastManager {
    private toast: HTMLElement;
    private timeout?: ReturnType<typeof setTimeout>;

    constructor() {
        this.toast = document.getElementById("toast")!;
    }

    show(message: string, type: ToastType = "info") {
        clearTimeout(this.timeout);

        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;

        this.timeout = setTimeout(() => {
            this.toast.classList.add("hidden");
        }, 1800);
    }

    success(message: string) {
        this.show(message, "success");
    }

    error(message: string) {
        this.show(message, "error");
    }

    info(message: string) {
        this.show(message, "info");
    }
}
