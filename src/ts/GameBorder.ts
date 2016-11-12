import GameObject from './common/GameObject';
import BoundingBox from './common/BoundingBox';
import * as IGame from './common/IGame';
export default class GameBorder extends GameObject implements IGame.IGameDisplayObject {

    private leftBorder: BoundingBox;
    private rightBorder: BoundingBox;
    private upBorder: BoundingBox;
    private downBorder: BoundingBox;
    private graphics: PIXI.Graphics;
    private wasDrawn: boolean = false;
    private showBorders: boolean = true;
    private borderSize = 5;
    constructor(gameWidth: number, gameHeight: number) {
        super();
        this.upBorder = new BoundingBox(new PIXI.Rectangle(0, 0, gameWidth, this.borderSize))
        this.leftBorder = new BoundingBox(new PIXI.Rectangle(0, 0, this.borderSize, gameHeight))
        this.rightBorder = new BoundingBox(new PIXI.Rectangle(gameWidth - this.borderSize, 0, this.borderSize, gameHeight))
        this.downBorder = new BoundingBox(new PIXI.Rectangle(0, gameHeight - this.borderSize, gameWidth, this.borderSize))
        if (this.showBorders) {
            this.graphics = new PIXI.Graphics();
        }

    }

    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        var data = this.checkCollision(boundingBox);
        return {
            name: this.constructor.name,
            isColliding: data.isColliding,
            direction: data.direction
        }
    }

    private checkCollision(boundingBox: BoundingBox): { isColliding: boolean; direction: IGame.CollisionDirection; } {
        let data = { isColliding: false, direction: IGame.CollisionDirection.Unknown };

        const borders: BoundingBox[] = [this.upBorder, this.downBorder, this.leftBorder, this.rightBorder];
        for (let border of borders) {
            if (border.collidesWith(boundingBox)) {
                data.direction = border.collidesInDirection(border, boundingBox);
                data.isColliding = true;
                return data;
            }
        }
        return data;
    }

    update(delta: number, state: IGame.IGameState): void {
        if (!this.showBorders || this.wasDrawn) {
            return;
        }
        this.graphics.beginFill(IGame.Colors.GameBorder, 1);
        const borders: BoundingBox[] = [this.upBorder, this.downBorder, this.leftBorder, this.rightBorder];
        for (let border of borders) {
            this.graphics.drawRect(border.x, border.y, border.width, border.height);
        }
        this.graphics.endFill();
        this.wasDrawn = true;
    }

    get displayObject(): PIXI.DisplayObject {
        return this.graphics
    }
}