/*
    These are modifiers that are always enabled once purchased. These will
    almost all be multiplier or % of total production.
*/

// I made this an interface because we don't have to do anything with the
// upgrade except invoke applyEffect()

// QUESTION Should this stay as an interface or become a class?
// If it is a class then we can default some of the properties.

// TODO Make some fields optional and default them in the creation loop?

export interface Upgrade {
    discovered: boolean;
    name: string;
    level: number;
    purchasable: boolean;
    victim: string[];
    // applyEffect: Function;
    applyEffect: (level: number, input: number) => number;
}


// export class Upgrade {
//     discovered: boolean = false;
//     id: number;
//     name: string;
//     level: number = 0
//     purchasable: boolean = false;
//     applyEffect: Function;
//     constructor(args) {
//         Object.assign(this, args)
//     }
// }
