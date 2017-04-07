import { random } from 'lodash';
import * as PIXI from 'pixi.js';
import Background from './../background/Manager';
import Border from './../Border';
import Coin from './../Coin';
import * as IGame from './../common/IGame';
import * as RS from './../common/ResourceSupport';
import Timer from './../common/Timer';
import Corner from './../Corner';
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
        for (const border of this.getGameBorders(game.width, game.height)) {
            game.addObject(border);
            context.objects.borders.push(border);
        }


        for (const corner of this.getCorners(game.width, game.height)) {
            game.addObject(corner);
        }
        game.addObject(new Background());
        game.addObject(new Ship(RS.createTexture('ship2.png'), RS.createTexture('ship2_to_left.png'), RS.createTexture('ship2_to_right.png')));
        game.addObject(new Score(game.width));
        context.timerService.add(Timer.create(1000, () => {
            game.addObject(new Coin(new PIXI.extras.AnimatedSprite(coinAnimationFrames), random(64, game.width - 64), 32));
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

    getGameBorders(width: number, height: number): Border[] {

        const gameBorders: Border[] = [];
        //up
        gameBorders.push(new Border(
            new PIXI.Rectangle(0, 0, width, this.borderSize),
            this.getBorderTexture('top')
        ));
        //down
        gameBorders.push(new Border(
            new PIXI.Rectangle(0, height - this.borderSize, width, this.borderSize),
            this.getBorderTexture('bottom')
        ));
        //left
        gameBorders.push(new Border(
            new PIXI.Rectangle(0, 0, this.borderSize, height),
            this.getBorderTexture('left')
        ));
        //right
        gameBorders.push(new Border(
            new PIXI.Rectangle(width - this.borderSize, 0, this.borderSize, height),
            this.getBorderTexture('right')
        ));

        return gameBorders;
    }

    getCorners(width: number, height: number): Corner[] {

        const corners: Corner[] = [];
        //left-top
        corners.push(new Corner(
            new PIXI.Rectangle(0, 0, this.borderSize, this.borderSize),
            this.getCornerTexture('left', 'top')
        ));
        //left-bottom
        corners.push(new Corner(
            new PIXI.Rectangle(0, height - this.borderSize, this.borderSize, this.borderSize),
            this.getCornerTexture('left', 'bottom')
        ));
        //right-top
        corners.push(new Corner(
            new PIXI.Rectangle(width - this.borderSize, 0, this.borderSize, this.borderSize),
            this.getCornerTexture('right', 'top')
        ));
        //right-bottom
        corners.push(new Corner(
            new PIXI.Rectangle(width - this.borderSize, height - this.borderSize, this.borderSize, this.borderSize),
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
