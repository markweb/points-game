import { EVENT } from "./types.js"
import { bank, events, generators } from "./app.js";
import { ClassicGenerator } from "./Generator.js";

export default class Renderer {


    private flagRenderPoints: boolean = true;
    private flagRenderProduction: boolean = true;

    renderTasks = [];

    constructor() {
        events.subscribe(EVENT.BANK_DEPOSIT, () => { this.flagRenderPoints = true })
        events.subscribe(EVENT.BANK_WITHDRAW, () => { this.flagRenderPoints = true })
        events.subscribe(EVENT.TICK_END, this.doRender.bind(this))
        events.subscribe(EVENT.GENERATOR_BUY, this.renderGenerator.bind(this))
        events.subscribe(EVENT.GENERATOR_BUY, this.renderProduction.bind(this))
        events.subscribe(EVENT.GENERATOR_PURCHASABLE, this.setGeneratorPurchasable.bind(this))
        events.subscribe(EVENT.GENERATOR_NOT_PURCHASABLE, this.setGeneratorNotPurchasable.bind(this))
        events.subscribe(EVENT.GAME_INITIALIZE_DOM, this.renderPoints.bind(this))
        events.subscribe(EVENT.GAME_INITIALIZE_DOM, this.renderProduction.bind(this))
    }

    doRender(now: number): void {
        for (const task of this.renderTasks) {
            if (now - task.lastUpdate > task.minInterval) {
                if ((task.requireDirty && this[task.flag]) || !task.requireDirty) {
                    this[`${task.func}`]();
                    this[task.flag] = false;
                }
                task.lastUpdate = now;
            }
        }
    }

    renderGenerator(gen: ClassicGenerator): void {
        const quantity = document.getElementById(`gen-${gen.getName()}-quantity`)
        const production = document.getElementById(`gen-${gen.getName()}-prodPer`)
        const buyNext = document.getElementById(`gen-${gen.getName()}-next`)

        quantity.textContent = gen.getQuantiy().toString()
        production.textContent = this.massageNumbers(gen.getProduction()).toString()
        buyNext.textContent = this.massageNumbers(gen.buyPrice()).toString()
    }

    renderPoints(): void {
        const pointsDiv = document.getElementById('points');
        pointsDiv.textContent = this.massageNumbers(bank.getBalance()).toString();
        this.flagRenderPoints = false;
    }

    renderProduction(): void {
        const pointsDiv = document.getElementById('prodPer');
        const totalProd = generators.reduce((acc, cur) => acc += cur.getProduction(), 0)
        pointsDiv.textContent = this.massageNumbers(totalProd).toString();
        this.flagRenderPoints = false;
    }

    renderUpgrades(): void { }

    setGeneratorPurchasable(gen: ClassicGenerator): void {
        const genDiv = document.getElementById(`gen-${gen.getName()}`)
        genDiv.classList.replace('cannotbuy', 'canbuy')
    }


    setGeneratorNotPurchasable(gen: ClassicGenerator): void {
        const genDiv = document.getElementById(`gen-${gen.getName()}`)
        genDiv.classList.replace('canbuy', 'cannotbuy')
    }

    massageNumbers(number) {
        return number < 100
            ? ((number * 10) / 10).toFixed(1)
            : number < 1000000
                ? Math.floor(number)
                : (
                    number /
                    (1000 ** Math.floor(number.toExponential().split('e+')[1] / 3) -
                        1)
                ).toFixed(3) +
                this.letterArray[
                Math.floor(number.toExponential().split('e+')[1] / 3) - 1
                ];
    }

    letterArray = [
        ' Thousand',
        ' Million',
        ' Billion',
        ' Trillion',
        ' Quadrillion',
        ' Quintillion',
        ' Sextillion',
        ' Septillion',
        ' Octillion',
        ' Nonillion',
        ' Decillion',
        ' Undecillion',
        ' Duodecillion',
        ' Tredecillion',
        ' Quatuordecillion',
        ' Quindecillion',
        ' Sexdecillion',
        ' Septendecillion',
        ' Octodecillion',
        ' Novemdecillion',
        ' Vigintillion',
        ' Unvigintillion',
        ' Duovigintillion',
        ' Tresvigintillion',
        ' Quatuorvigintillion',
        ' Quinquavigintillion',
        ' Sesvigintillion',
        ' Septemvigintillion',
        ' Octovigintillion',
        ' Novemvigintillion',
        ' Trigintillion',
        ' Untrigintillion',
        ' Duotrigintillion',
        ' Trestrigintillion',
        ' Quattuortrigintillion',
        ' Quintrigintillion',
        ' Sestrigintillion',
        ' Septentrigintillion',
        ' Octotrigintillion',
        ' Noventrigintillion',
        ' Quadragintillion',
    ];
}
