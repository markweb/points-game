import { events, generatorsByName, player, generators, upgrades, upgradesByName, renderer } from "./app.js"
import { EVENT } from "./types.js"
import { createGeneratorElement, addGameContainerHandlers } from "./DOMHandler.js"
import { rawGenerators, rawUpgrades } from "./objects.js"
import { ClassicGenerator } from "./Generator.js"

export function init() {
    events.subscribe(EVENT.GENERATOR_CREATED, (args) => {
        const gDiv = document.getElementById('generators')
        const newDiv = createGeneratorElement(args)
        gDiv.appendChild(newDiv)
    })

    events.subscribe(EVENT.GAME_INITIALIZE_DOM, addGameContainerHandlers.bind(this))

    generatorsByName.set(player.getName(), player)

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
        tag: 'points',
        flag: 'flagRenderPoints',
        func: 'renderPoints',
        lastUpdate: 0,
        minInterval: 100,
        requireDirty: true,
    })

    renderer.renderTasks.push({
        tag: 'generatorPurchasable',
        flag: 'flagRenderPoints',
        func: 'setGeneratorPurchasable',
        lastUpdate: 0,
        minInterval: 100,
        requireDirty: false,
    })
}