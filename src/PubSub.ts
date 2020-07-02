export default class PubSub {
    private subscribers: Object = {};
    private keys = ['pre', 'main', 'post']
    private defaultKey = "main"
    constructor() { }

    subscribe(event: string | number, callback: Function, key: string = this.defaultKey): PubSub {
        if (event === null || event === undefined || event === '') return
        if (this.keys.indexOf(key) === -1) return
        this.subscribers[event] = this.subscribers[event] || this.eventStub();
        this.subscribers[event][key].push(callback);
        return this
    }

    // I'm not a huge fan of this, but I don't want to JSON.parse(JSON.stringify)
    // just to tack a few arrays onto an object
    eventStub(): Object {
        const newObj = {}
        for (const k of this.keys) {
            newObj[k] = []
        }
        return newObj
    }

    publish(...params: any[]): void {
        const [event, ...args] = params
        if (this.subscribers[event]) {
            for (const k of this.keys) {
                const subs = this.subscribers[event][k]
                for (const sub of subs) {
                    sub(...args)
                }
            }
        }
    }
}