export const rawGenerators = [
    {
        name: 'one',
        baseProduction: 1,
        cost: 10,
    }
]

export const rawUpgrades = [
    {
        name: 'doubler',
        multiplier: 2,
        victim: ['one', 'player'],
        applyEffect: function (level: number, input: number): number {
            return input * (this.multiplier ** level)
        }
    },
    {
        name: 'tenecks',
        multiplier: 10,
        victim: ['one', 'player'],
        applyEffect: function (level: number, input: number): number {
            return input * this.multiplier * level || input
        }
    },
]

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