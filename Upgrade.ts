export class Upgrade {
    discovered: boolean = false;
    id: number;
    name: string;
    level: number = 0
    purchasable: boolean = false;
    applyEffect: Function;
    constructor(args) {
        Object.assign(this, args)
    }
}
