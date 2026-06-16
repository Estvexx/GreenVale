import pt from "./pt.json";
import en from "./en.json";
import es from "./es.json";

const languages: Record<string, typeof pt> = { pt, en, es };

export function t(key: string): string {
    const lang = localStorage.getItem("lang") || "pt";
    const keys = key.split(".");
    let result: any = languages[lang];
    for (const k of keys) result = result?.[k];
    return result ?? key; // se não encontrar, devolve a própria key
}

export function setLanguage(lang: string) {
    localStorage.setItem("lang", lang);
    applyTranslations();
    window.dispatchEvent(new Event("greenvale:languagechange"));
}

export function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;
        el.textContent = t(key);
    });
}
