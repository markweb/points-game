import { EVENT, Result } from "./types.js"
import { bank, events, upgradesByName } from "./app.js";

abstract class Generator {
    protected baseProduction: number = 0;
    protected upgradedProduction: number = 0;

    protected cost: number = 0;
    protected quantity: number = 0;
    protected name: string = '';

    protected upgrades: Map<string, number> = new Map();

    constructor(args) {
        Object.assign(this, args)
        this.recalculate()
    }

    getName() {
        return this.name;
    }

    getProduction() {
        return this.upgradedProduction;
    }

    getQuantiy(): number {
        return this.quantity;
    }

    abstract produce(coefficient: number): Result

    buy(amount: number): Result {
        const [res, bal] = bank.withdraw(amount * this.cost)

        if (res) {
            this.quantity += amount;
            events.publish(EVENT.FLAG_DIRTY_GENERATOR)
            events.publish(EVENT.GENERATOR_BUY)
        }
        return [res, bal]
    }

    recalculate(): void {
        const upgradeMultiplier = this.applyUpgrades()
        this.upgradedProduction = this.quantity * this.baseProduction * upgradeMultiplier
    }

    attachUpgrade(name: string, amount: number) {
        this.upgrades.set(name, amount)
    }

    updateUpgrade(name: string, amount: number) {
        this.upgrades.set(name, amount)
    }

    applyUpgrades(input: number = 1): number {
        let accumulatedValue = input
        for (const [upgradeName, upgradeLevel] of this.upgrades) {
            accumulatedValue = upgradesByName.get(upgradeName).applyEffect(upgradeLevel, accumulatedValue)
        }
        return accumulatedValue
    }
}


export class ClassicGenerator extends Generator {
    constructor(args) {
        super(args)
        events.subscribe(EVENT.GENERATOR_RUN, this.produce.bind(this))
        events.subscribe(EVENT.GENERATOR_BUY, this.recalculate.bind(this))
    }

    produce(coefficient: number): Result {
        if (this.quantity === 0) return
        // QUESTION Is accessing 'bank' directly some sort of bad practice?
        const [res, bal] = bank.deposit(Math.floor(coefficient * this.getProduction() * 100) / 100)
        return [res, bal]
    }
}


export class Player extends Generator {
    private static instance: Player;
    private clicksLifetime: number = 0;
    private clicksSession: number = 0;

    private constructor(args) {
        super(args);
        events.subscribe(EVENT.PLAYER_CLICK, this.clickEvent.bind(this))
    }

    // HACK Making this a singleton to test the pattern.
    static getInstance() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new Player({ name: 'player', baseProduction: 1, cost: 0, quantity: 1 })
        return this.instance
    }

    clickEvent() {
        this.clicksLifetime++
        this.clicksSession++
        this.produce()
    }

    produce(): Result {
        const [res, bal] = bank.deposit(this.getProduction())
        return [res, bal]
    }

    getClicksLifetime() {
        return this.clicksLifetime
    }

    getClicksSession() {
        return this.clicksSession
    }
}