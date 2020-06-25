import { EVENT } from "./types.js"
import { bank, events } from "./app.js";

export default class Renderer {
    flagDirtyGenerators: boolean = true;
    flagDirtyStatusBar: boolean = true;
    flagDirtyUpgrades: boolean = true;

    renderTasks = [];

    constructor() {
        events.subscribe(EVENT.FLAG_DIRTY_GENERATOR, this.setDirtyGenerators.bind(this))
        events.subscribe(EVENT.FLAG_DIRTY_STATUS_BAR, this.setDirtyStatusBar.bind(this))
        events.subscribe(EVENT.FLAG_DIRTY_UPGRADE, this.setDirtyUpgrades.bind(this))
        events.subscribe(EVENT.BANK_DEPOSIT, this.setDirtyStatusBar.bind(this))
        events.subscribe(EVENT.BANK_WITHDRAW, this.setDirtyStatusBar.bind(this))
        events.subscribe(EVENT.TICK_END, this.doRender.bind(this))
    }


    setDirtyGenerators(): void {
        this.flagDirtyGenerators = true;
    }

    setDirtyStatusBar(): void {
        this.flagDirtyStatusBar = true;
    }

    setDirtyUpgrades(): void {
        this.flagDirtyUpgrades = true;
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

    renderGenerators(): void { }

    renderStatusBar(): void {
        const pointsDiv = document.getElementById('points');
        pointsDiv.textContent = Math.round(bank.getBalance()).toString();
        this.flagDirtyStatusBar = false;
    }

    renderUpgrades(): void { }
}