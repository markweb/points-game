import Bank from "./Bank.js";
import PubSub from "./PubSub.js";
import Renderer from "./Renderer.js";
import Timer from "./Timer.js";

import { EVENT } from "./types.js"
import { init } from "./init.js"
import { ClassicGenerator, Player } from "./Generator.js";

export const bank: Bank = new Bank();
export const events = new PubSub();
export const generators: ClassicGenerator[] = [];
export const generatorsByName: Map<string, ClassicGenerator | Player> = new Map();
export const player: Player = Player.getInstance();
export const renderer = new Renderer();
export const timer: Timer = new Timer();


// QUESTION Is there a better way to expose this to the console?
globalThis.Game = {
    bank,
    events,
    generators,
    generatorsByName,
    player,
    renderer,
    timer,
};

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


init();

events.publish(EVENT.GAME_INITIALIZE_DOM)

loop();

