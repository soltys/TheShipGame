import * as IGame from './IGame';
import CollisionDirection from './CollisionDirection';
class BoundingBox implements IGame.IBoundingBox {
    private rectangle: PIXI.Rectangle;

    collidesWith(gameObject: BoundingBox): boolean {
        if (this.rectangle.x < gameObject.x + gameObject.width &&
            this.rectangle.x + this.rectangle.width > gameObject.x &&
            this.rectangle.y < gameObject.y + gameObject.height &&
            this.rectangle.height + this.rectangle.y > gameObject.y) {
            return true;
        }
        else {
            return false;
        }

    }

    getEdges(box, gameObject) {
        return {
            "boxLeft": box.rectangle.x,
            "boxRight": box.rectangle.x + box.rectangle.width,
            "boxTop": box.rectangle.y,
            "boxBottom": box.rectangle.y + box.rectangle.height,
            "gameObjectLeft": gameObject.rectangle.x,
            "gameObjectRight": gameObject.rectangle.x + gameObject.rectangle.width,
            "gameObjectTop": gameObject.rectangle.y,
            "gameObjectBottom": gameObject.rectangle.y + gameObject.rectangle.height
        };
    }

    collidesInDirection(box, gameObject): CollisionDirection {
        let edges = this.getEdges(box, gameObject);

        let offsetLeft = edges.gameObjectRight - edges.boxLeft;
        let offsetRight = edges.boxRight - edges.gameObjectLeft;
        let offsetTop = edges.gameObjectBottom - edges.boxTop;
        let offsetBottom = edges.boxBottom - edges.gameObjectTop;

        if (Math.min(offsetLeft, offsetRight, offsetTop, offsetBottom) === offsetTop) {
            return CollisionDirection.Down;
        }

        if (Math.min(offsetLeft, offsetRight, offsetTop, offsetBottom) === offsetBottom) {
            return CollisionDirection.Up;
        }

        if (Math.min(offsetLeft, offsetRight, offsetTop, offsetBottom) === offsetLeft) {
            return CollisionDirection.Right;
        }

        if (Math.min(offsetLeft, offsetRight, offsetTop, offsetBottom) === offsetRight) {
            return CollisionDirection.Left;
        }

        return CollisionDirection.Unknown;
    }
    get x() {
        return this.rectangle.x;
    }

    set x(value) {
        this.rectangle.x = value;
    }

    get y() {
        return this.rectangle.y;
    }

    set y(value) {
        this.rectangle.y = value;
    }

    get width() {
        return this.rectangle.width;
    }

    set width(value) {
        this.rectangle.width = value;
    }

    get height() {
        return this.rectangle.height;
    }

    set height(value) {
        this.rectangle.height = value;
    }
    constructor(rectangle: PIXI.Rectangle) {
        this.rectangle = rectangle;
    }

    update(state: IGame.IGameContext) {

    }

    clone(): BoundingBox {
        return new BoundingBox(this.rectangle.clone());
    }
}

export default BoundingBox;