import * as PIXI from 'pixi.js';
import { DisplayLayer } from '@core/DisplayLayer';
import GameObject from '@core/GameObject';
import * as IGame from '@IGame';
import * as RS from './ResourceSupport';
export default class Bullet extends GameObject implements IGame.IGameDisplayObject {
    private bulletAnimation: PIXI.extras.AnimatedSprite;
    private graphics: PIXI.Graphics;
    constructor(bulletAnimation: PIXI.extras.AnimatedSprite, posX: number, posY: number) {
        super();
        this.bulletAnimation = bulletAnimation;
        this.bulletAnimation.position.set(posX, posY);
        this.bulletAnimation.animationSpeed = 0.1;
        this.bulletAnimation.play();
        this.graphics = new PIXI.Graphics();
    }

    update(timeDelta: number, context: IGame.IGameContext) {
        this.bulletAnimation.y -= 8;

        if (this.bulletAnimation.y < 30) {
            context.game.removeObject(this);
        }
    }
    get displayObjects(): PIXI.DisplayObject[] {
        return [this.graphics, this.bulletAnimation];
    }

    get displayLayer(): DisplayLayer {
        return DisplayLayer.Main;
    }

    static bulletAnimationFrames;
    static create(posX: number, posY: number): Bullet {
        this.bulletAnimationFrames = RS.createAnimation('bullet', 2);
        return new Bullet(new PIXI.extras.AnimatedSprite(this.bulletAnimationFrames), posX, posY);
    }

}
