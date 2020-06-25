import { EVENT, IGenerator, Result, IUpgrade } from "./types.js"
import { bank, events } from "./app.js";
import { MultiplierUpgrade } from "./Upgrade.js";

export default class Generator implements IGenerator {
    baseProduction: number;
    productionMultiplier: number = 1;
    calculatedProduction: number;
    cost: number;
    quantity: number = 0;
    // FIXME
    // Should the upgrades be completely separate or attached to the
    // Generator object?
    upgrades: IUpgrade[] = [];

    constructor(args) {
        Object.assign(this, args)
        // FIXME
        // Again, is there a better way of linking an upgrade to a generator?
        this.upgrades.push(new MultiplierUpgrade())
        // FIXME
        // Decide if subscriptions belong in constructor or in a function called
        // by the constructor.
        this.configureSubscriptions();
    }

    configureSubscriptions(): void {
        events.subscribe(EVENT.GENERATOR_RUN, this.deposit.bind(this))
    }

    getQuantiy(): number {
        return this.quantity;
    }

    getProduction(): number {
        return this.quantity * this.baseProduction * this.productionMultiplier
    }

    // TODO
    // Once we figure out upgrades this may have to change.
    applyUpgrades() {
        for (const upgrade of this.upgrades) {
            this.calculatedProduction = upgrade.applyEffect(this.calculatedProduction)
        }
    }

    deposit(coefficient: number): Result {
        const [res, bal] = bank.deposit(Math.floor(coefficient * this.getProduction() * 100) / 100)
        return [res, bal]
    }

    // TODO
    // Actually implement this.
    buy(amount: number): Result {
        const [res, bal] = bank.withdraw(amount * this.cost)

        if (res) {
            this.quantity += amount;
            events.publish(EVENT.FLAG_DIRTY_GENERATOR)
        }
        return [res, bal]
    }

    // TODO
    // Implement this. Recalculate once and cache the result. Called whenever
    // a change happens to the base object, upgrades, or effects.
    recalculate(): void {

    }
}