import * as IGame from './../common/IGame';
import BaseState from './BaseState';
import * as PIXI from 'pixi.js';
import PlayState from './PlayState';

export default class Init extends BaseState {

    constructor() {
        super();

    }
    handle(context: IGame.IGameContext) {

        PIXI.loader.add([
            'assets/animation/coin.json',
            'assets/animation/bullet.json',
            'assets/ship2_to_left.png',
            'assets/ship2_to_right.png',
            'assets/ship2.png',
            'assets/borders/top.png',
            'assets/borders/bottom.png',
            'assets/borders/left.png',
            'assets/borders/right.png',
            'assets/borders/corner_right_top.png',
            'assets/borders/corner_left_top.png',
            'assets/borders/corner_right_bottom.png',
            'assets/borders/corner_left_bottom.png'

        ]).load((load, ret) => {
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
