import * as IGame from './../common/IGame';
import Ship from './../Ship';
//import Coin from './../Coin';
import FPSCounter from './../FPSCounter';
import Score from './../Score';
import GameBorder from './../GameBorder';
import GameCorner from './../GameCorner';
import BaseState from './BaseState';
import * as RS from './../common/ResourceSupport';

type Sides = "left" |  "right";  
type TopOrBottom = "top"  | "bottom";
type Directions = Sides|TopOrBottom;

export default class PlayState extends BaseState {
    private borderSize = 16;

    handle(context: IGame.IGameContext) {
        const game = context.game;
        //const coinAnimationFrames = RS.createAnimation("coin", 7);

        game.addObject(new FPSCounter());
        for (const border of this.getGameBorders(game.gameWidth, game.gameHeight)) {
            game.addObject(border);
        }

        for (const corner of this.getCorners(game.gameWidth, game.gameHeight)) {
            game.addObject(corner);
        }

        game.addObject(new Ship(RS.createTexture('ship.png'), RS.createTexture('ship_to_left.png'), RS.createTexture('ship_to_right.png')));
        game.addObject(new Score(game.gameWidth));

        /*setInterval(function () {
            game.addObject(new Coin(new PIXI.extras.AnimatedSprite(coinAnimationFrames), getRandomInt(20, game.gameWidth - 20), getRandomInt(20, game.gameHeight - 20)));
        }, 1000);*/
    }

    getGameBorders(gameWidth: number, gameHeight: number): GameBorder[] {

        const gameBorders: GameBorder[] = [];
        //up
        gameBorders.push(new GameBorder(
            new PIXI.Rectangle(0, 0, gameWidth, this.borderSize),
            this.getBorderTexture('top')
        ));
        //down
        gameBorders.push(new GameBorder(
            new PIXI.Rectangle(0, gameHeight - this.borderSize, gameWidth, this.borderSize),
            this.getBorderTexture('bottom')
        ));
        //left
        gameBorders.push(new GameBorder(
            new PIXI.Rectangle(0, 0, this.borderSize, gameHeight),
            this.getBorderTexture('left')
        ));
        gameBorders.push(new GameBorder(
            new PIXI.Rectangle(gameWidth - this.borderSize, 0, this.borderSize, gameHeight),
            this.getBorderTexture('right')
        ));

        return gameBorders;
    }

    getCorners(gameWidth: number, gameHeight: number): GameCorner[] {

        const corners: GameCorner[] = [];
        //left-top
        corners.push(new GameCorner(
            new PIXI.Rectangle(0, 0, this.borderSize, this.borderSize),
            this.getCornerTexture("left", 'top')
        ));
        //left-bottom
        corners.push(new GameCorner(
            new PIXI.Rectangle(0, gameHeight - this.borderSize, this.borderSize, this.borderSize),
            this.getCornerTexture("left", 'bottom')
        ));

        corners.push(new GameCorner(
            new PIXI.Rectangle(gameWidth - this.borderSize, 0, this.borderSize, this.borderSize),
            this.getCornerTexture("right", 'top')
        ));
        corners.push(new GameCorner(
            new PIXI.Rectangle(gameWidth - this.borderSize, gameHeight - this.borderSize, this.borderSize, this.borderSize),
            this.getCornerTexture("right", 'bottom')
        ));

        return corners;
    }

    getBorderTexture(name: Directions): PIXI.Texture {
        return PIXI.Texture.fromImage(`assets/borders/${name}.png`, undefined, PIXI.SCALE_MODES.NEAREST);
    }

    getCornerTexture(leftOrRight: Sides , topOrBottom: TopOrBottom): PIXI.Texture {
        return PIXI.Texture.fromImage(`assets/borders/corner_${leftOrRight}_${topOrBottom}.png`, undefined, PIXI.SCALE_MODES.NEAREST);
    }
}

/*function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}*/

