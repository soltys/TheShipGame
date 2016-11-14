import GameObject from './common/GameObject';
import BoundingBox from './common/BoundingBox';
import * as IGame from './common/IGame';
import * as _ from 'lodash';

export default class Coin extends GameObject implements IGame.IGameDisplayObject {
    private coinAnimation: PIXI.extras.MovieClip
    private box: BoundingBox;
    private coinWidth = 16;
    private coinHeight = 16;
    /**
     *
     */
    constructor(coinAnimation: PIXI.extras.MovieClip, posX: number, posY: number) {
        super();
        this.coinAnimation = coinAnimation;

        coinAnimation.position.set(posX, posY);
        this.box = new BoundingBox(new PIXI.Rectangle(posX, posY, this.coinWidth, this.coinHeight));
        coinAnimation.anchor.set(0.5);
        coinAnimation.animationSpeed = 0.2;


        coinAnimation.play();

    }

    update(timeDelta: number, state: IGame.IGameState) {
        state.objects.forEach(gameObject => {
            if (this === gameObject) {
                return;
            }

            //Current Colision
            const collisionData = gameObject.collideWith(this.box);
            if (collisionData.isColliding && collisionData.name === "Ship") {
                state.score.addToScore(10);
             
                state.game.removeObject(this);
            }
        });
    }




    get displayObject(): PIXI.DisplayObject {
        return this.coinAnimation;
    }

} 