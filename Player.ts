import { events, bank } from "./app.js";
import { EVENT, IPlayer, IUpgrade, Result } from "./types.js";


// FIXME
// Player should probably just extend a Generator class.
// Think it over and put it off until it is too late.


export default class Player implements IPlayer {
    baseClickValue: number = 1;
    realClickValue: number = 0;
    clicksLifetime: number = 0;
    clicksSession: number = 0;
    // FIXME
    // Is this a better way to attach an upgrade?
    doubler: IUpgrade;


    constructor() {
        events.subscribe(EVENT.PLAYER_CLICK, this.clickEvent.bind(this))
        // FIXME
        // Surely there is a better way of doing this?
        // this.calculateClickValue();
    }

    clickEvent() {
        this.clicksLifetime++
        this.clicksSession++
        this.clickEarn()
    }

    clickEarn(): Result {
        // FIXME
        // Is accessing 'bank' directly some sort of bad practice?
        const [res, bal] = bank.deposit(this.getClickValue())
        return [res, bal]
    }

    // FIXME
    // Fix this after we sort out upgrades
    // calculateClickValue(): void {
    //     this.realClickValue = this.doubler.applyEffect(this.baseClickValue)
    // }

    getClickValue(): number {
        return this.realClickValue
    }
}