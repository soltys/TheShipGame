import GameObject from './common/GameObject';
import * as IGame from './common/IGame';

export default class Bullet extends GameObject implements IGame.IGameDisplayObject {
    private bulletAnimation: PIXI.extras.AnimatedSprite

    constructor(bulletAnimation: PIXI.extras.AnimatedSprite, posX: number, posY: number) {
        super();
        this.bulletAnimation = bulletAnimation;
        this.bulletAnimation.position.set(posX, posY);
        this.bulletAnimation.animationSpeed = 0.1;
        this.bulletAnimation.play();

    }


    get displayObjects(): PIXI.DisplayObject[] {
        return [this.bulletAnimation];
    }

} 