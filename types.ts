export interface ITimer {
    getTicksPerSecond(): number;
    getTicksLifetime(): number;
    getTicksSession(): number;
    addTicks(ticks: number): void;
    getLastTick(): number;
    setLastTick(tickTime: number): void;
}

export interface IBank {
    getBalance(): number;
    deposit(amount: number): Result;
    withdraw(amount: number): Result;
}

export interface IGenerator {
    baseProduction: number;
    productionMultiplier: number;
    cost: number;
    quantity: number;
    // upgrades: [string, number][];
    upgrades: Map<string, number>;
    getQuantiy(): number;
    getProduction(): number;
    deposit(coefficient: number): Result;
    buy(amount: number): Result;

}

export interface IPlayer {
    baseClickValue: number;
    realClickValue: number;
    doubler: IUpgrade;
    clickEarn(coefficient: number): Result
    getClickValue(): number
}

export interface IPubSub {
    subscribe(event: string | number, callback: Function)
    publish()
}

export interface ISerialize {
    serialize(): string
    deserialize(): void
}

export interface IUpgrade {
    discovered: boolean;
    level: number;
    id: number;
    name: string;
    purchasable: boolean;
    // applyEffect(level: number, amount: number): number
    applyEffect: Function;
}

export type Result = [ResponseType, number];

export enum ResponseType {
    REJECT,
    ACCEPT
}

export enum EVENT {
    BANK_DEPOSIT,
    BANK_WITHDRAW,

    EFFECT_GAINED,
    EFFECT_LOST,

    FLAG_DIRTY_GENERATOR,
    FLAG_DIRTY_STATUS_BAR,
    FLAG_DIRTY_UPGRADE,

    GENERATOR_RUN,
    GENERATOR_STOP,
    GENERATOR_RECALCULATE,
    GENERATOR_BUY,
    GENERATOR_SELL,

    PLAYER_CLICK,

    TICK_START,
    TICK_END,
    TICK_COUNT,
}