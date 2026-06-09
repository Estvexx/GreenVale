type Listener = () => void;

export class TimeSystem {
    private static instance: TimeSystem;

    static getInstance(): TimeSystem {
        if (!this.instance) {
            this.instance = new TimeSystem();
        }

        return this.instance;
    }

    private day = 1;
    private minutes = 6 * 60; // começa às 06:00
    private speed = 30; // 1 segundo real = 5 minutos no jogo

    private listeners: Listener[] = [];

    onChange(callback: Listener): () => void {
        this.listeners.push(callback);
        return () => { this.listeners = this.listeners.filter(l => l !== callback); };
    }

    private notify() {
        this.listeners.forEach((callback) => callback());
    }

    update(delta: number) {
        const oldMinute = Math.floor(this.minutes);

        this.minutes += (delta / 1000) * this.speed;

        if (this.minutes >= 1440) {
            this.minutes = 0;
            this.day++;
        }

        if (Math.floor(this.minutes) !== oldMinute) {
            this.notify();
        }
    }

    getDay(): number {
        return this.day;
    }

    getHour(): number {
        return Math.floor(this.minutes / 60);
    }

    getMinute(): number {
        return Math.floor(this.minutes % 60);
    }

    getTimeText(): string {
        const hour = String(this.getHour()).padStart(2, "0");
        const minute = String(this.getMinute()).padStart(2, "0");

        return `${hour}:${minute}`;
    }

    // VASCO ve aqui para o crescimento das plantas
    getDarkness(): number {
        const hour = this.getHour() + this.getMinute() / 60;

        if (hour >= 21 || hour < 5) {
            return 0.55;
        }
        if (hour >= 5 && hour < 7) {
            return 0.3;
        }
        if (hour >= 7 && hour < 18) {
            return 0.03;
        }
        if (hour >= 18 && hour < 21) {
            return 0.35;
        }

        return 0.03;
    }
}
