import * as IGame from '@IGame';
import BaseState from './BaseState';
import PlayState from './PlayState';
import { ResourcesForLoader } from '@core/ResourceSupport';
//import MenuState from './MenuState';

export default class Init extends BaseState {
    constructor() {
        super();

    }
    handle(context: IGame.IGameContext) {

        PIXI.loader
            .add(ResourcesForLoader())
            .load(() => {
                const gameHostEl = document.getElementById('gameHost');
                const fpsCounterEl = document.getElementById('fps-counter');
                if (gameHostEl === null) {
                    return;
                }
                const game = context.game;
                game.gotoState(new PlayState());
                game.addRendererToElement(gameHostEl);
                if (fpsCounterEl !== null) {
                    game.addFPSCounter(fpsCounterEl);
                }
                game.addEventListenerToElement(document.body);
                game.animate();
            });
    }

    onLeave(context: IGame.IGameContext) {

    }
}
