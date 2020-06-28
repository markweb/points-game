import Bank from "./Bank.js";
import PubSub from "./PubSub.js";
import Renderer from "./Renderer.js";
import Timer from "./Timer.js";

import { addGameContainerHandlers } from "./DOMHandler.js";
import { EVENT } from "./types.js"
import { rawGenerators, rawUpgrades } from "./objects.js"
import { ClassicGenerator, Player } from "./Generator.js";
import { Upgrade } from "./Upgrade.js"


export const bank: Bank = new Bank();
export const events = new PubSub();
export const generators: ClassicGenerator[] = [];
export const generatorsByName: Map<string, ClassicGenerator | Player> = new Map();
export const player: Player = Player.getInstance();
export const renderer = new Renderer();
export const timer: Timer = new Timer();
export const upgrades: Upgrade[] = [];
export const upgradesByName: Map<string, Upgrade> = new Map();

// QUESTION Is there a better way to expose this to the console?
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

generatorsByName.set(player.getName(), player)

// FIXME This stuff belongs somewhere else
for (const generator of rawGenerators) {
    const newGenObj = new ClassicGenerator(generator)
    generators.push(newGenObj)
    generatorsByName.set(newGenObj.getName(), newGenObj)
}

for (const upgrade of rawUpgrades) {
    // const newUpgradeObj = new Upgrade(upgrade)
    upgrades.push(upgrade)
    upgradesByName.set(upgrade.name, upgrade)

    for (const victim of upgrade.victim) {
        generatorsByName.get(victim).attachUpgrade(upgrade.name, 0)
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

function loop() {
    const now = Date.now();
    const tickTime = 1000 / timer.getTicksPerSecond();
    const tickDiff = now - timer.getLastTick();
    const ticks = Math.floor(tickDiff / tickTime)
    if (ticks) {
        events.publish(EVENT.TICK_COUNT, ticks)
        events.publish(EVENT.TICK_START, (now - (tickDiff % tickTime)))

        // TODO Put a game somewhere in this basic area

        events.publish(EVENT.GENERATOR_RUN, ticks / timer.getTicksPerSecond())



        events.publish(EVENT.TICK_END, (now - (tickDiff % tickTime)))
    }
    window.requestAnimationFrame(loop);
}


addGameContainerHandlers()

loop();
