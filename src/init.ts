import { events, generatorsByName, player, generators, renderer } from "./app.js"
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
        Object.assign(generator, { id: generators.length })
        const newGenObj = new ClassicGenerator(generator)
        generators.push(newGenObj)
        generatorsByName.set(newGenObj.getName(), newGenObj)
    }

    renderer.renderTasks.push({
        tag: 'points',
        flag: 'flagRenderPoints',
        func: 'renderPoints',
        lastUpdate: 0,
        minInterval: 100,
        requireDirty: true,
    })
}