import { EVENT, ITimer } from "./types.js"
import { events } from "./app.js";


export default class Timer implements ITimer {
    ticksPerSecond: number = 20;
    ticksLifetime: number = 0;
    ticksSession: number = 0;
    tickLast: number = 0;

    constructor() {
        this.tickLast = Date.now()
        events.subscribe(EVENT.TICK_COUNT, this.addTicks.bind(this))
        events.subscribe(EVENT.TICK_END, this.setLastTick.bind(this))
    }

    getTicksPerSecond(): number {
        return this.ticksPerSecond;
    }

    getTicksLifetime(): number {
        return this.ticksLifetime;
    }

    getTicksSession(): number {
        return this.ticksSession;
    }

    addTicks(ticks: number = 1): void {
        this.ticksLifetime += ticks;
        this.ticksSession += ticks;
    }

    getLastTick(): number {
        return this.tickLast;
    }

    setLastTick(tickTime: number): void {
        this.tickLast = tickTime;
    }
}