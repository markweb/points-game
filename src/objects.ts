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
        name: 'doubler10',
        displayName: "doubler at 10",
        level: 0,
        maxLevels: 10,
        multiplier: 2,
        unlockInterval: 10,
        victims: ['one'],
        applyEffect: function (level: number, input: number): number {
            return input * (this.multiplier ** level)
        }
    },
    {
        name: 'doubler25',
        displayName: "double at 25",
        level: 0,
        maxLevels: 10,
        multiplier: 2,
        unlockInterval: 25,
        victims: ['two', 'three'],
        applyEffect: function (level: number, input: number): number {
            return input * (this.multiplier ** level)
        }
    },
    {
        level: 0,
        displayName: "tenecks at 100",
        name: 'tenecks',
        maxLevels: 10,
        multiplier: 10,
        unlockInterval: 100,
        victims: ['one', 'player'],
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