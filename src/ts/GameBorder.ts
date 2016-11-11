import GameObject from './common/GameObject';
import BoundingBox from './common/BoundingBox';
import * as IGame from './common/IGame';
export default class GameBorder extends GameObject {

    private leftBorder: BoundingBox;
    private rightBorder: BoundingBox;
    private upBorder: BoundingBox;
    private downBorder: BoundingBox;
    constructor() {
        super();
        this.upBorder = new BoundingBox(new PIXI.Rectangle(0, 0, 500, 10))
        this.leftBorder = new BoundingBox(new PIXI.Rectangle(0, 0, 10, 500))
        this.rightBorder = new BoundingBox(new PIXI.Rectangle(390, 0, 10, 500))
        this.downBorder = new BoundingBox(new PIXI.Rectangle(0, 490, 500, 10))
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
                data.isColliding  = true;
                return data;
            }
        }
        return data;
    }

    update(delta: number, state: IGame.IGameState): void {
      
    }
}