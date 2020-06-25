import { IUpgrade } from "./types.js";

class Upgrade implements IUpgrade {
    level: number = 0
    discovered: boolean = false;
    purchasable: boolean = false;
    constructor() {

    }

    applyEffect(amount: number) {
        return amount;
    }
}

export class MultiplierUpgrade extends Upgrade {
    multiplier: number = 2;
    constructor() {
        super()
    }

    applyEffect(amount: number): number {
        return amount * (this.multiplier ** this.level)
    }
}