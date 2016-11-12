import GameObject from './common/GameObject';
import { PlayerAction, GetPlayerAction } from './PlayerAction';
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

    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        var data = this.checkCollision(boundingBox);
        return {
            name: this.constructor.name,
            isColliding: data.isColliding,
            direction: data.direction
        }
    }
    private checkCollision(boundingBox: BoundingBox): { isColliding: boolean; direction: IGame.CollisionDirection; } {
        let data = { isColliding: false, direction: IGame.CollisionDirection.Unknown };
        if (this.box.collidesWith(boundingBox)) {
            data.direction = this.box.collidesInDirection(this.box, boundingBox);
            data.isColliding = true;
            return data;
        }

        return data;
    }

    get displayObject(): PIXI.DisplayObject {
        return this.coinAnimation;
    }

} 