import { events } from "./app.js";
import { EVENT } from "./types.js";
import { ClassicGenerator } from "./Generator.js";
import { Upgrade } from "./Upgrade.js";

// Element creation/destruction goes in here.
// All value and style changes should happen in Renderer.ts

export function createGeneratorElement(gen: ClassicGenerator) {
    const genDiv = document.createElement('div');

    let blockString = `<div class="entity cannotbuy" id="gen-${gen.getName()}">`;
    blockString += `<div id="gen-${gen.getName()}-name">Generator ${gen.getName()} x<span id="gen-${gen.getName()}-quantity">${gen.getQuantiy()}</span></div>`;
    blockString += `<div id="gen-${gen.getName()}-production">Producing: ⅊<span id="gen-${gen.getName()}-prodPer">${gen.getProduction()}</span>/s</div>`;
    blockString += `<div id="gen-${gen.getName()}-upgrade">Next: ⅊<span id="gen-${gen.getName()}-next">${gen.buyPrice()}</span></div></div>`;
    genDiv.innerHTML = blockString;

    genDiv.addEventListener(
        'click',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            const modState = 0b00 | e.shiftKey | (e.ctrlKey << 1);

            gen.buy();
        }.bind(this)
    );

    return genDiv
}

// FIXME Re-imagine how upgrades are detected and purchased. Redo this entire block for upgrades.
// export function createUpgradeElement(upgrade: Upgrade) {
//     const upgradeDiv = document.createElement('div');

//     let blockString = `<div class="upgrade hidden" id="upgrade-${upgrade.name}">`;
//     blockString += `<div id="upgrade-${upgrade.name}-name">Upgrade Gen ${upgrade.get} x<span id="upgrade-${upgrade.name}-quantity">${upgrade.getQuantiy()}</span></div>`;
//     blockString += `<div id="upgrade-${upgrade.name}-production">Producing: ⅊<span id="upgrade-${upgrade.name}-prodPer">${upgrade.getProduction()}</span>/s</div>`;
//     blockString += `<div id="upgrade-${upgrade.name}-upgrade">Next: ⅊<span id="upgrade-${upgrade.name}-next">${upgrade.buyPrice()}</span></div></div>`;
//     upgradeDiv.innerHTML = blockString;

//     upgradeDiv.addEventListener(
//         'click',
//         function (e) {
//             e.preventDefault();
//             e.stopPropagation();

//             // TODO buy upgrade?
//             // upgrade.buy();
//         }.bind(this)
//     );

//     return upgradeDiv
// }


export function addGameContainerHandlers() {
    const gc = document.getElementById('gameContainer');
    gc.addEventListener(
        'click',
        function (e) {
            e.preventDefault();
            e.stopPropagation();
            events.publish(EVENT.PLAYER_CLICK)
        }
    );

    gc.addEventListener('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    gc.addEventListener('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
}