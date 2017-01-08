import * as IGame from './../common/IGame';
import Ship from './../Ship';
import Coin from './../Coin';
import FPSCounter from './../FPSCounter';
import Score from './../Score';
import GameBorder from './../GameBorder';
import BaseState from './BaseState';
import * as RS from './../common/ResourceSupport';
export default class PlayState extends BaseState {
    handle(context: IGame.IGameContext) {
        const game = context.game;
        const coinAnimationFrames = RS.createAnimation("coin", 7);

        game.addObject(new FPSCounter());
        for (let border of getGameBorders(game.gameWidth, game.gameHeight)) {
            game.addObject(border);
        }

        game.addObject(new Ship(RS.createTexture('ship.png'), RS.createTexture('ship_to_left.png'), RS.createTexture('ship_to_right.png')));
        game.addObject(new Score(game.gameWidth));

        setInterval(function () {
            game.addObject(new Coin(new PIXI.extras.AnimatedSprite(coinAnimationFrames), getRandomInt(20, game.gameWidth - 20), getRandomInt(20, game.gameHeight - 20)));
        }, 1000);
    }
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getGameBorders(gameWidth: number, gameHeight: number): GameBorder[] {
    const borderSize = 5;
    const gameBorders: GameBorder[] = [];
    //up
    gameBorders.push(new GameBorder(
        new PIXI.Rectangle(0, 0, gameWidth, borderSize)
    ));
    //down
    gameBorders.push(new GameBorder(
        new PIXI.Rectangle(0, gameHeight - borderSize, gameWidth, borderSize)
    ));
    //left
    gameBorders.push(new GameBorder(
        new PIXI.Rectangle(0, 0, borderSize, gameHeight)
    ));
    gameBorders.push(new GameBorder(
        new PIXI.Rectangle(gameWidth - borderSize, 0, borderSize, gameHeight)
    ));

    return gameBorders;
}