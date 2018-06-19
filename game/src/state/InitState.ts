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
                const game = context.game;
                game.gotoState(new PlayState());
                game.addRendererToElement(document.getElementById('gameHost'));
                game.addFPSCounter(document.getElementById('fps-counter'));
                game.addEventListenerToElement(document.body);
                game.animate();
            });
    }

    onLeave(context: IGame.IGameContext) {

    }
}
