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
        victim: ['one'],
        applyEffect: function (level: number, input: number): number {
            return input * (this.multiplier ** level)
        }
    },
    {
        name: 'Centy',
        multiplier: 100,
        victim: ['one'],
        applyEffect: function (level: number, input: number): number {
            return input * this.multiplier * level || input
        }
    }
]