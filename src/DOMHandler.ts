import { events } from "./app.js";
import { EVENT } from "./types.js";
import { ClassicGenerator } from "./Generator.js";

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