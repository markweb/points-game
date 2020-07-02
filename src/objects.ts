export const rawGenerators = [
    {
        name: 'one',
    },
    {
        name: 'two',
    },
    {
        name: 'three',
    }
]


export const rawUpgrades = [
    {
        discovered: false,
        displayName: "doubler at 10",
        level: 0,
        name: 'doubler10',
        maxLevels: 10,
        multiplier: 2,
        purchasable: false,
        unlockInterval: 10,
        victim: ['one'],
        applyEffect: function (level: number, input: number): number {
            return input * (this.multiplier ** level)
        }
    },
    {
        discovered: false,
        displayName: "double at 25",
        level: 0,
        name: 'doubler25',
        maxLevels: 10,
        multiplier: 2,
        purchasable: false,
        unlockInterval: 25,
        victim: ['two', 'three'],
        applyEffect: function (level: number, input: number): number {
            return input * (this.multiplier ** level)
        }
    },
    {
        discovered: false,
        level: 0,
        displayName: "tenecks at 100",
        name: 'tenecks',
        multiplier: 10,
        purchasable: false,
        unlockInterval: 100,
        victim: ['one', 'player'],
        applyEffect: function (level: number, input: number): number {
            return input * this.multiplier * level || input
        }
    },
]

// TODO Implement Effects at some point. More powerful than Upgrades but temporary.
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