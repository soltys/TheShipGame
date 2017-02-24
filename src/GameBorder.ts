import * as PIXI from 'pixi.js';
import GameObject from './common/GameObject';
import BoundingBox from './common/BoundingBox';
import * as IGame from './common/IGame';
export default class GameBorder extends GameObject implements IGame.IGameDisplayObject {

    private border: BoundingBox;
    
    private tilingSprite: PIXI.extras.TilingSprite;
    constructor(rect: PIXI.Rectangle, texture:PIXI.Texture) {
        super();
        this.border = new BoundingBox(rect);
        
        this.tilingSprite = new PIXI.extras.TilingSprite(texture,rect.width,rect.height);
        this.tilingSprite.x = rect.x;
        this.tilingSprite.y = rect.y;
               
    }

    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        const data =  super.checkCollision(this.border, boundingBox);
        return {
            name: "GameBorder",
            isColliding: data.isColliding,
            direction: data.direction,
            collisionBox: data.collisionBox
        };
    }

   
    update(delta: number, state: IGame.IGameContext): void {       
    }

    get displayObjects(): PIXI.DisplayObject[] {
        return [this.tilingSprite];
    }
}