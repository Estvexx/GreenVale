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

    onChange(callback: Listener) {
        this.listeners.push(callback);
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
            console.log("Noite");
            return 0.55; // noite
        }
        if (hour >= 5 && hour < 7) {
            console.log("Amanhecer");
            return 0.3; // amanhecer
        }
        if (hour >= 7 && hour < 18) {
            console.log("Dia");
            return 0.03; // dia
        }
        if (hour >= 18 && hour < 21) {
            console.log("Fim de tarde");
            return 0.35; // fim de tarde
        }

        return 0.03;
    }
}
