import GameObject from './common/GameObject';
import BoundingBox from './common/BoundingBox';
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

    collideWith(boundingBox: BoundingBox): boolean {
        return this.upBorder.collidesWith(boundingBox) || this.downBorder.collidesWith(boundingBox)
            || this.leftBorder.collidesWith(boundingBox) || this.rightBorder.collidesWith(boundingBox);
    }

    update(delta: number, state: IGameState): void {
        this.leftBorder.update(state);
        this.upBorder.update(state);
        this.downBorder.update(state);
        this.rightBorder.update(state);
    }
}