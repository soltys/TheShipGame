import * as PIXI from 'pixi.js';
import BoundingBox from './common/BoundingBox';
import DisplayLayer from './common/DisplayLayer';
import GameObject from './common/GameObject';
import * as IGame from './common/IGame';

export default class Coin extends GameObject implements IGame.IGameDisplayObject {
    private coinAnimation: PIXI.extras.AnimatedSprite;
    private box: BoundingBox;
    private coinWidth = 8;
    private coinHeight = 8;

    constructor(coinAnimation: PIXI.extras.AnimatedSprite, posX: number, posY: number) {
        super();
        this.coinAnimation = coinAnimation;

        coinAnimation.position.set(posX, posY);
        coinAnimation.animationSpeed = 0.2;
        coinAnimation.play();

        this.box = new BoundingBox(new PIXI.Rectangle(posX, posY, this.coinWidth, this.coinHeight));
        this.box.linkSprite(this.coinAnimation);
    }

    update(timeDelta: number, context: IGame.IGameContext) {
        //Current Colision
        const collisionData = context.objects.ship.collideWith(this.box);
        if (collisionData.isColliding && collisionData.name === 'Ship') {
            context.objects.score.addToScore(10);

            context.game.removeObject(this);
            return;
        }

        if (this.box.y > context.game.height) {
            context.game.removeObject(this);
            return;
        }
        this.box.y += 1;
    }

    get displayObjects(): PIXI.DisplayObject[] {
        return [this.coinAnimation];
    }

    get displayLayer(): DisplayLayer {
        return DisplayLayer.Main;
    }
}
