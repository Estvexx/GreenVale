let autoSaveHandler: (() => void) | null = null;
let paused = false;

export function setAutoSaveHandler(handler: () => void) {
    autoSaveHandler = handler;
}

export function requestAutoSave() {
    if (paused) return;
    autoSaveHandler?.();
}

export function pauseAutoSave(callback: () => void) {
    paused = true;

    try {
        callback();
    } finally {
        paused = false;
    }
}
