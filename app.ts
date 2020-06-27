import { EVENT, IGenerator, IBank, ITimer, IPlayer, IUpgrade } from "./types.js"
import Bank from "./Bank.js";
import Renderer from "./Renderer.js";
import Timer from "./Timer.js";
import PubSub from "./PubSub.js";
import { addGameContainerHandlers } from "./DOMHandler.js";
import Player from "./Player.js";
import { rawGenerators, rawUpgrades } from "./objects.js"
import Generator from "./Generator.js";
import { Upgrade } from "./Upgrade.js"


export const bank: IBank = new Bank();
export const events = new PubSub();
export const generators: IGenerator[] = [];
export const generatorsByName: Map<string, IGenerator> = new Map();
export const player: IPlayer = new Player();
export const renderer = new Renderer();
export const timer: ITimer = new Timer();
export const upgrades: IUpgrade[] = [];
export const upgradesByName: Map<string, IUpgrade> = new Map();

// FIXME
// This stuff belongs in objects.ts or some other initialization file.
for (const generator of rawGenerators) {
    const newGenObj = new Generator(generator)
    newGenObj.id = generators.length
    generators.push(newGenObj)
    generatorsByName.set(newGenObj.name, newGenObj)
}

for (const upgrade of rawUpgrades) {
    const newUpgradeObj = new Upgrade(upgrade)
    newUpgradeObj.id = upgrades.length
    upgrades.push(newUpgradeObj)
    upgradesByName.set(newUpgradeObj.name, newUpgradeObj)

    for (const victim of upgrade.victim) {
        generatorsByName.get(victim).upgrades.set(upgrade.name, 0)
    }
}

renderer.renderTasks.push({
    tag: 'statusbar',
    flag: 'flagDirtyStatusBar',
    func: 'renderStatusBar',
    lastUpdate: 0,
    minInterval: 100,
    requireDirty: true,
})

// FIXME
// I think this is a reasonable way to expose an object to the console.
// Should other classes reference this object or the new instance ones above?
globalThis.Game = {
    bank,
    events,
    generators,
    generatorsByName,
    player,
    renderer,
    timer,
    upgrades,
    upgradesByName
};

function loop() {
    const now = Date.now();
    const tickTime = 1000 / timer.getTicksPerSecond();
    const tickDiff = now - timer.getLastTick();
    const ticks = Math.floor(tickDiff / tickTime)
    if (ticks) {
        events.publish(EVENT.TICK_COUNT, ticks)
        events.publish(EVENT.TICK_START, (now - (tickDiff % tickTime)))

        // TODO
        // Put a game somewhere in this basic area

        events.publish(EVENT.GENERATOR_RUN, ticks / timer.getTicksPerSecond())



        events.publish(EVENT.TICK_END, (now - (tickDiff % tickTime)))
    }
    window.requestAnimationFrame(loop);
}


addGameContainerHandlers()

loop();
