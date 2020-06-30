export default class PubSub {
    private subscribers: Object = {};
    private lastEvent: string | number = ''
    constructor() { }

    subscribe(event: string | number, callback: Function): PubSub {
        if (event === null || event === undefined || event === '') return
        this.subscribers[event] = this.subscribers[event] || { pre: [], main: [], post: [] };
        this.subscribers[event].main.push(callback);
        this.lastEvent = event;
        return this
    }

    pre(): void {
        if (this.lastEvent === '') return
        const lastEvent = this.subscribers[this.lastEvent].main.pop()
        this.subscribers[this.lastEvent].pre.push(lastEvent)
        this.lastEvent = ''
    }

    post(): void {
        if (this.lastEvent === '') return
        const lastEvent = this.subscribers[this.lastEvent].main.pop()
        this.subscribers[this.lastEvent].post.push(lastEvent)
        this.lastEvent = ''
    }

    publish(...params: any[]): void {
        const [event, ...args] = params
        if (this.subscribers[event]) {
            const keys = ['pre', 'main', 'post']
            for (const k of keys) {
                const subs = this.subscribers[event][k]
                for (const sub of subs) {
                    sub(...args)
                }
            }
        }
    }
}