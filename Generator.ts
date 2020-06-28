import { EVENT, Result } from "./types.js"
import { bank, events, upgradesByName } from "./app.js";

class Generator {
    baseProduction: number = 0;
    upgradedProduction: number = 0;

    cost: number = 0;
    quantity: number = 0;
    name: string = '';

    upgrades: Map<string, number> = new Map();

    constructor(args) {
        Object.assign(this, args)
    }

    getProduction() {
        return this.upgradedProduction;
    }

    getQuantiy(): number {
        return this.quantity;
    }

    deposit(coefficient: number): Result {
        if (this.quantity === 0) return
        const [res, bal] = bank.deposit(Math.floor(coefficient * this.getProduction() * 100) / 100)
        return [res, bal]
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
}


export class ClassicGenerator extends Generator {
    constructor(args) {
        super(args);

        // Object.assign(this, args)

        events.subscribe(EVENT.GENERATOR_RUN, this.deposit.bind(this))
        events.subscribe(EVENT.GENERATOR_BUY, this.recalculate.bind(this))
    }

    buy(amount: number): Result {
        const [res, bal] = bank.withdraw(amount * this.cost)

        if (res) {
            this.quantity += amount;
            events.publish(EVENT.FLAG_DIRTY_GENERATOR)
            events.publish(EVENT.GENERATOR_BUY)
        }
        return [res, bal]
    }
}


export class Player extends Generator {
    clicksLifetime: number = 0;
    clicksSession: number = 0;

    constructor(args) {
        super(args);
        events.subscribe(EVENT.PLAYER_CLICK, this.clickEvent.bind(this))
    }

    clickEvent() {
        this.clicksLifetime++
        this.clicksSession++
        this.deposit()
    }

    deposit(): Result {
        // QUESTION Is accessing 'bank' directly some sort of bad practice?
        const [res, bal] = bank.deposit(this.getProduction())
        return [res, bal]
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
}