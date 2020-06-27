import { IUpgrade } from "./types.js";


// TODO
//Make a Map of upgrades. Save onto other objects as tuple [upgradeID, level]



export class Upgrade implements IUpgrade {
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
