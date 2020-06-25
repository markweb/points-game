import { events } from "./app.js";
import { EVENT } from "./types.js";

// TODO
// Element creation/destruction goes in here. All value and style changes should
// happen in Renderer.ts
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