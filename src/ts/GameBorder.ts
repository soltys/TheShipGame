import GameObject from './common/GameObject';
import BoundingBox from './common/BoundingBox';
import * as IGame from './common/IGame';
export default class GameBorder extends GameObject implements IGame.IGameDisplayObject {

    private border: BoundingBox;
    private graphics: PIXI.Graphics;
    private wasDrawn: boolean = false;
    private showBorders: boolean = true;

    constructor(rect: PIXI.Rectangle) {
        super();
        this.border = new BoundingBox(rect);

        if (this.showBorders) {
            this.graphics = new PIXI.Graphics();
        }
    }

    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        var data =  super.checkCollision(this.border, boundingBox);
        return {
            name: this.constructor.name,
            isColliding: data.isColliding,
            direction: data.direction,
            collisionBox: data.collisionBox
        }
    }

   
    update(delta: number, state: IGame.IGameContext): void {
        if (!this.showBorders || this.wasDrawn) {
            return;
        }
        this.graphics.beginFill(IGame.Colors.GameBorder, 1);
        this.graphics.drawRect(this.border.x, this.border.y, this.border.width, this.border.height);
        this.graphics.endFill();
        this.wasDrawn = true;
    }

    get displayObjects(): PIXI.DisplayObject[] {
        return [this.graphics];
    }
}