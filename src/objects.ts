export const rawGenerators = [
    {
        name: 'one',
        baseProduction: 1,
        cost: 10,
    },
    {
        name: 'two',
        baseProduction: 1,
        cost: 10,
    },
    {
        name: 'three',
        baseProduction: 1,
        cost: 10,
    }
]


export const rawUpgrades = [
    {
        discovered: false,
        level: 0,
        name: 'doubler',
        multiplier: 2,
        purchasable: false,
        victim: ['one', 'two', 'three', 'player'],
        applyEffect: function (level: number, input: number): number {
            return input * (this.multiplier ** level)
        }
    },
    {
        discovered: false,
        level: 0,
        name: 'tenecks',
        multiplier: 10,
        purchasable: false,
        victim: ['one', 'player'],
        applyEffect: function (level: number, input: number): number {
            return input * this.multiplier * level || input
        }
    },
]

// TODO Implement this at some point. More powerful than Upgrades but temporary.
export const rawEffects = [
    {
        name: 'doubler',
        multiplier: 2,
        victim: ['player'],
        applyEffect: function (level: number, input: number): number {
            return input * (this.multiplier ** level)
        }
    },
]