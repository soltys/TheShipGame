import * as PIXI from 'pixi.js';
import DisplayLayer from './DisplayLayer';
import GameObject from './GameObject';
import * as IGame from './IGame';
export default class GameCorner extends GameObject implements IGame.IGameDisplayObject {

    private cornerSprite: PIXI.Sprite;
    constructor(rect: PIXI.Rectangle, texture: PIXI.Texture) {
        super();

        this.cornerSprite = new PIXI.Sprite(texture);
        this.cornerSprite.x = rect.x;
        this.cornerSprite.y = rect.y;

    }

    get displayObjects(): PIXI.DisplayObject[] {
        return [this.cornerSprite];
    }

    get displayLayer(): DisplayLayer {
        return DisplayLayer.Main;
    }
}
