import { ResponseType, Result, EVENT } from "./types.js"
import { events } from "./app.js";

export default class Bank {
    private balance: number = 0

    constructor() {
    }

    deposit(amount: number): Result {
        this.balance += amount;
        const result = ResponseType.ACCEPT;
        events.publish(EVENT.BANK_DEPOSIT, this.balance)
        return [result, this.balance];
    }

    withdraw(amount: number): Result {
        let result = ResponseType.REJECT;

        if (this.balance >= amount) {
            this.balance -= amount;
            result = ResponseType.ACCEPT;
            events.publish(EVENT.BANK_WITHDRAW, this.balance)

        }
        return [result, this.balance];
    }

    getBalance(): number {
        return this.balance
    }

}