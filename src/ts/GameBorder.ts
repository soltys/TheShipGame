import GameObject from './common/GameObject';
import BoundingBox from './common/BoundingBox';
import * as IGame from './common/IGame';
import Colors from './common/Colors';
export default class GameBorder extends GameObject implements IGame.IGameDisplayObject {

    private border: BoundingBox;
    private graphics: PIXI.Graphics;
    private wasDrawn: boolean = false;
    private showBorders: boolean = true;
    private tilingSprite: PIXI.extras.TilingSprite;
    constructor(rect: PIXI.Rectangle, texture:PIXI.Texture) {
        super();
        this.border = new BoundingBox(rect);
        
        this.tilingSprite = new PIXI.extras.TilingSprite(texture,rect.width,rect.height);
        this.tilingSprite.x = rect.x;
        this.tilingSprite.y = rect.y;
        
        if (this.showBorders) {
            this.graphics = new PIXI.Graphics();
        }
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
        if (!this.showBorders || this.wasDrawn) {
            return;
        }
        this.graphics.beginFill(Colors.GameBorder, 1);
        this.graphics.drawRect(this.border.x, this.border.y, this.border.width, this.border.height);
        this.graphics.endFill();
        this.wasDrawn = true;
    }

    get displayObjects(): PIXI.DisplayObject[] {
        return [this.graphics, this.tilingSprite];
    }
}