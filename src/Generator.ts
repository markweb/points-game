import { EVENT, Result } from "./types.js"
import { bank, events } from "./app.js";

abstract class Generator {
    protected baseProduction: number = 0;
    protected upgradedProduction: number = 0;

    protected cost: number = 0;
    protected costCoefficient: number = 1.07;
    protected quantity: number = 0;
    protected name: string = '';
    protected purchasable: boolean = false;

    constructor(args) {
        Object.assign(this, args)
        this.recalculate()
    }

    abstract produce(coefficient: number): Result

    getName() {
        return this.name;
    }

    getProduction() {
        return this.upgradedProduction;
    }

    getQuantiy(): number {
        return this.quantity;
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
        this.upgradedProduction = this.quantity * this.baseProduction
    }
}

export class ClassicGenerator extends Generator {
    private id: number;
    constructor(args) {
        super(args)

        this.cost = Math.floor(10 ** (this.id + 1 + this.id / 10));
        this.baseProduction = Math.max(this.cost / (100 + this.id * 10), 0.1);
        this.costCoefficient = 1.07 + this.id / 200;

        events.subscribe(EVENT.GENERATOR_RUN, this.produce.bind(this))
        events.subscribe(EVENT.GENERATOR_RUN, this.calculatePurchasable.bind(this), EVENT.POST)
        events.publish(EVENT.GENERATOR_CREATED, this)
    }

    produce(coefficient: number): Result {
        if (this.quantity === 0) return
        // QUESTION Is accessing 'bank' directly some sort of bad practice?
        const [res, bal] = bank.deposit((coefficient * this.getProduction() * 100) / 100)
        return [res, bal]
    }

    buy(amount: number = 1): Result {
        const [res, bal] = bank.withdraw(this.buyPrice(amount))

        if (res) {
            this.quantity += amount;
            this.recalculate();
            events.publish(EVENT.GENERATOR_BUY, this)
        }
        return [res, bal]
    }

    calculatePurchasable() {
        const canPurchase = bank.getBalance() >= this.buyPrice() ? true : false
        if (canPurchase == this.purchasable) {
            return
        } else {
            this.purchasable = canPurchase;
            events.publish(canPurchase ? EVENT.GENERATOR_PURCHASABLE : EVENT.GENERATOR_NOT_PURCHASABLE, this)
        }
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