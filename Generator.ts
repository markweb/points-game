import { EVENT, IGenerator, Result } from "./types.js"
import { bank, events, upgradesByName } from "./app.js";

export default class Generator implements IGenerator {
    baseProduction: number;
    calculatedProduction: number = 0;
    cost: number;
    id: number;
    name: string;
    productionMultiplier: number = 0;
    quantity: number = 0;
    upgrades: Map<string, number> = new Map();

    constructor(args) {
        Object.assign(this, args)

        events.subscribe(EVENT.GENERATOR_RUN, this.deposit.bind(this))
        events.subscribe(EVENT.GENERATOR_BUY, this.recalculate.bind(this))
    }

    getQuantiy(): number {
        return this.quantity;
    }

    getProduction(): number {
        return this.calculatedProduction
    }

    deposit(coefficient: number): Result {
        const [res, bal] = bank.deposit(Math.floor(coefficient * this.getProduction() * 100) / 100)
        return [res, bal]
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

    recalculate(): void {
        this.productionMultiplier = this.applyUpgrades()
        this.calculatedProduction = this.quantity * this.baseProduction * this.productionMultiplier
    }

    applyUpgrades(input: number = 1): number {
        let accumulatedValue = input
        for (const [upgradeName, upgradeLevel] of this.upgrades) {
            accumulatedValue = upgradesByName.get(upgradeName).applyEffect(upgradeLevel, accumulatedValue)
        }
        return accumulatedValue
    }
}