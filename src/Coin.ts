import * as PIXI from 'pixi.js';
import BoundingBox from './common/BoundingBox';
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
        this.box = new BoundingBox(new PIXI.Rectangle(posX, posY, this.coinWidth, this.coinHeight));        
        coinAnimation.animationSpeed = 0.2;
        coinAnimation.play();

    }

    update(timeDelta: number, context: IGame.IGameContext) {
        context.objects.all.forEach(gameObject => {
            if (this === gameObject) {
                return;
            }

            //Current Colision
            const collisionData = gameObject.collideWith(this.box);
            if (collisionData.isColliding && collisionData.name === "Ship") {
                context.objects.score.addToScore(10);
             
                context.game.removeObject(this);
            }
        });
    }




    get displayObjects(): PIXI.DisplayObject[] {
        return [this.coinAnimation];
    }

} 