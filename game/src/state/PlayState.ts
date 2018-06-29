import { random } from 'lodash';
import * as PIXI from 'pixi.js';
import Background from './../background/Manager';
import Border from './../Border';
import Coin from './../Coin';
import * as IGame from '@IGame';
import * as RS from '@core/ResourceSupport';
import Timer from './../Timer';
import Corner from './../Corner';
import Score from './../Score';
import Ship from './../Ship';
import Base from './BaseState';

export default class Play extends Base {
    private borderSize = 32;
    private onVisibilityChangedProxy: EventListener | undefined;
    handle(context: IGame.IGameContext) {
        const game = context.game;

        for (const border of this.getGameBorders(game.width, game.height)) {
            game.addObject(border);
            context.objects.borders.push(border);
        }

        this.getCorners(game.width, game.height)
            .forEach(corner => game.addObject(corner));

        game.addObject(new Background());
        game.addObject(new Ship(RS.getTexture('ship'), RS.getTexture('ship_to_left'), RS.getTexture('ship_to_right')));
        game.addObject(new Score(game.width));
        context.timerService.add(Timer.create(1000, () => {
            const coinAnimationFrames = RS.createAnimation('coin_animation', 7);
            game.addObject(new Coin(coinAnimationFrames, random(64, game.width - 64), 32));
        }));

        this.onVisibilityChangedProxy = () => this.onVisibilityChange(game);

        document.addEventListener('visibilitychange', this.onVisibilityChangedProxy, false);
    }

    onLeave(context: IGame.IGameContext) {
        if (this.onVisibilityChangedProxy !== undefined) {
            document.removeEventListener('visibilitychange', this.onVisibilityChangedProxy);
        }
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
            RS.getTexture('border_top')
        ));
        //down
        gameBorders.push(new Border(
            new PIXI.Rectangle(0, height - this.borderSize, width, this.borderSize),
            RS.getTexture('border_bottom')
        ));
        //left
        gameBorders.push(new Border(
            new PIXI.Rectangle(0, 0, this.borderSize, height),
            RS.getTexture('border_left')
        ));
        //right
        gameBorders.push(new Border(
            new PIXI.Rectangle(width - this.borderSize, 0, this.borderSize, height),
            RS.getTexture('border_right')
        ));

        return gameBorders;
    }

    getCorners(width: number, height: number): Corner[] {
        const corners: Corner[] = [];
        //left-top
        corners.push(new Corner(
            new PIXI.Rectangle(0, 0, this.borderSize, this.borderSize),
            RS.getCornerTexture('left', 'top')
        ));
        //left-bottom
        corners.push(new Corner(
            new PIXI.Rectangle(0, height - this.borderSize, this.borderSize, this.borderSize),
            RS.getCornerTexture('left', 'bottom')
        ));
        //right-top
        corners.push(new Corner(
            new PIXI.Rectangle(width - this.borderSize, 0, this.borderSize, this.borderSize),
            RS.getCornerTexture('right', 'top')
        ));
        //right-bottom
        corners.push(new Corner(
            new PIXI.Rectangle(width - this.borderSize, height - this.borderSize, this.borderSize, this.borderSize),
            RS.getCornerTexture('right', 'bottom')
        ));
        return corners;
    }


}
