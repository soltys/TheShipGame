import GameObject from './common/GameObject';
import * as IGame from './common/IGame';

export default class Bullet extends GameObject implements IGame.IGameDisplayObject {
    private bulletAnimation: PIXI.extras.MovieClip

    constructor(bulletAnimation: PIXI.extras.MovieClip, posX: number, posY: number) {
        super();
        this.bulletAnimation = bulletAnimation;
        this.bulletAnimation.position.set(posX, posY);
        this.bulletAnimation.animationSpeed = 0.1;
        this.bulletAnimation.play();

    }


    get displayObject(): PIXI.DisplayObject {
        return this.bulletAnimation;
    }

} 