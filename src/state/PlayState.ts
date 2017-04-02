import { random } from 'lodash';
import * as PIXI from 'pixi.js';
import Coin from './../Coin';
import * as IGame from './../common/IGame';
import * as RS from './../common/ResourceSupport';
import Timer from './../common/Timer';
import GameBorder from './../GameBorder';
import GameCorner from './../GameCorner';
import Score from './../Score';
import Ship from './../Ship';
import Base from './BaseState';
type Sides = 'left' | 'right';
type TopOrBottom = 'top' | 'bottom';
type Directions = Sides | TopOrBottom;

export default class Play extends Base {
    private borderSize = 32;
    private onVisibilityChangedProxy: EventListener;
    handle(context: IGame.IGameContext) {
        const game = context.game;
        const coinAnimationFrames = RS.createAnimation('coin', 7);
        for (const border of this.getGameBorders(game.gameWidth, game.gameHeight)) {
            game.addObject(border);
            context.objects.borders.push(border);
        }


        for (const corner of this.getCorners(game.gameWidth, game.gameHeight)) {
            game.addObject(corner);
        }

        game.addObject(new Ship(RS.createTexture('ship2.png'), RS.createTexture('ship2_to_left.png'), RS.createTexture('ship2_to_right.png')));
        game.addObject(new Score(game.gameWidth));
        context.timerService.add(Timer.create(1000, () => {
            game.addObject(new Coin(new PIXI.extras.AnimatedSprite(coinAnimationFrames), random(64, game.gameWidth - 64), random(64, game.gameHeight - 64)));
        }));

        this.onVisibilityChangedProxy = () => this.onVisibilityChange(game);

        document.addEventListener('visibilitychange', this.onVisibilityChangedProxy, false);
    }

    onLeave(context: IGame.IGameContext) {
        document.removeEventListener('visibilitychange', this.onVisibilityChangedProxy);
    }

    onVisibilityChange(game: IGame.IHost) {
        if (document['hidden']) {
            //pause game           
            game.pause();
        } else {
            //resume     
            game.animate();
        }
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
            this.getCornerTexture('left', 'top')
        ));
        //left-bottom
        corners.push(new GameCorner(
            new PIXI.Rectangle(0, gameHeight - this.borderSize, this.borderSize, this.borderSize),
            this.getCornerTexture('left', 'bottom')
        ));
        //right-top
        corners.push(new GameCorner(
            new PIXI.Rectangle(gameWidth - this.borderSize, 0, this.borderSize, this.borderSize),
            this.getCornerTexture('right', 'top')
        ));
        //right-bottom
        corners.push(new GameCorner(
            new PIXI.Rectangle(gameWidth - this.borderSize, gameHeight - this.borderSize, this.borderSize, this.borderSize),
            this.getCornerTexture('right', 'bottom')
        ));

        return corners;
    }

    getBorderTexture(name: Directions): PIXI.Texture {
        return PIXI.Texture.fromImage(`assets/borders/${name}.png`, undefined, PIXI.SCALE_MODES.NEAREST);
    }

    getCornerTexture(leftOrRight: Sides, topOrBottom: TopOrBottom): PIXI.Texture {
        return PIXI.Texture.fromImage(`assets/borders/corner_${leftOrRight}_${topOrBottom}.png`, undefined, PIXI.SCALE_MODES.NEAREST);
    }
}
