import * as PIXI from 'pixi.js';
import { DisplayLayer } from '@core/DisplayLayer';
import GameObject from '@core/GameObject';
import * as IGame from '@IGame';
import * as RS from '@core/ResourceSupport';
import Axis from '@core/Axis';
export default class Bullet extends GameObject implements IGame.IGameDisplayObject {
    /*
        Bullet Width when changing sprite update this value
    */
    public static bulletWidth = 16;

    private bulletAnimation: PIXI.extras.AnimatedSprite;
    private readonly initialVelocity = 8;
    private velocity: Axis;

    constructor(bulletAnimation: PIXI.extras.AnimatedSprite, posX: number, posY: number) {
        super();
        this.bulletAnimation = bulletAnimation;
        this.bulletAnimation.position.set(posX, posY);
        this.bulletAnimation.animationSpeed = 0.1;
        this.bulletAnimation.play();
        this.velocity = new Axis(0, this.initialVelocity);
    }

    update(timeDelta: number, context: IGame.IGameContext) {

        //this.velocity.multiplyByNumber(timeDelta).multiply(-1);
        const deltaX = this.velocity.x * timeDelta;
        const deltaY = this.velocity.y * timeDelta;
        this.bulletAnimation.y -= deltaY;
        this.bulletAnimation.x -= deltaX;

        if (this.bulletAnimation.y < 30) {
            context.game.removeObject(this);
        }
    }
    get displayObjects(): PIXI.DisplayObject[] {
        return [this.bulletAnimation];
    }

    get displayLayer(): DisplayLayer {
        return DisplayLayer.Main;
    }

    static create(posX: number, posY: number): Bullet {
        return new Bullet(RS.createAnimation('bullet_animation', 2), posX, posY);
    }

}
