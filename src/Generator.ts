import { EVENT, Result } from "./types.js"
import { bank, events, upgradesByName, generators } from "./app.js";

abstract class Generator {
    protected baseProduction: number = 0;
    protected upgradedProduction: number = 0;

    protected cost: number = 0;
    protected costCoefficient: number = 1.07;
    protected quantity: number = 0;
    protected name: string = '';
    protected purchasable: boolean = false;
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

    buy(amount: number = 1): Result {
        const [res, bal] = bank.withdraw(this.buyPrice(amount))

        if (res) {
            this.quantity += amount;
            this.recalculate();
            events.publish(EVENT.GENERATOR_BUY, this)
        }
        return [res, bal]
    }

    buyPrice(amount: number = 1) {
        return (
            this.cost *
            ((this.costCoefficient ** this.quantity *
                (this.costCoefficient ** amount - 1)) /
                (this.costCoefficient - 1))
        );
    }

    recalculate(): void {
        const upgradeMultiplier = this.applyUpgrades()
        this.upgradedProduction = this.quantity * this.baseProduction * upgradeMultiplier
    }

    applyUpgrades(input: number = 1): number {
        let accumulatedValue = input
        for (const [upgradeName, upgradeLevel] of this.upgrades) {
            accumulatedValue = upgradesByName.get(upgradeName).applyEffect(upgradeLevel, accumulatedValue)
        }
        return accumulatedValue
    }

    attachUpgrade(name: string, amount: number) {
        this.upgrades.set(name, amount)
    }

    updateUpgrade(name: string, amount: number) {
        this.upgrades.set(name, amount)
    }
}

export class ClassicGenerator extends Generator {
    private id: number;
    constructor(args) {
        super(args)

        this.id = generators.length;
        this.cost = Math.floor(10 ** (this.id + 1 + this.id / 10));
        this.baseProduction = Math.max(this.cost / (100 + this.id * 10), 0.1);
        this.costCoefficient = 1.07 + this.id / 200;

        events.subscribe(EVENT.GENERATOR_RUN, this.produce.bind(this))
        events.subscribe(EVENT.GENERATOR_RUN, this.calculatePurchasable.bind(this))
        events.publish(EVENT.GENERATOR_CREATED, this)
    }

    produce(coefficient: number): Result {
        if (this.quantity === 0) return
        // QUESTION Is accessing 'bank' directly some sort of bad practice?
        const [res, bal] = bank.deposit((coefficient * this.getProduction() * 100) / 100)
        return [res, bal]
    }

    calculatePurchasable() {
        this.purchasable = bank.getBalance() >= this.buyPrice() ? true : false
    }

    isPurchasable(): boolean {
        return this.purchasable
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