export default class PubSub {
    private subscribers = {};

    constructor() { }

    subscribe(event: string | number, callback: Function): void {
        this.subscribers[event] = this.subscribers[event] || [];
        this.subscribers[event].push(callback);
    }

    publish(...params: any[]): void {
        const [event, ...args] = params
        if (this.subscribers && this.subscribers[event]) {
            const subs = this.subscribers[event]
            for (const sub of subs) {
                sub(...args)
            }
        }
    }
}