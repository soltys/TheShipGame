import { CollisionDirection } from '@core/CollisionDirection';
import * as IGame from '@IGame';
class BoundingBox implements IGame.IBoundingBox {
    private rectangle: PIXI.Rectangle;
    private sprite: PIXI.Sprite;
    linkSprite(sprite: PIXI.Sprite) {
        this.sprite = sprite;
    }

    collidesWith(gameObject: BoundingBox): boolean {
        if (this.rectangle.x < gameObject.x + gameObject.width &&
            this.rectangle.x + this.rectangle.width > gameObject.x &&
            this.rectangle.y < gameObject.y + gameObject.height &&
            this.rectangle.height + this.rectangle.y > gameObject.y) {
            return true;
        } else {
            return false;
        }

    }

    getEdges(box: BoundingBox, gameObject: BoundingBox) {
        return {
            boxLeft: box.rectangle.x,
            boxRight: box.rectangle.x + box.rectangle.width,
            boxTop: box.rectangle.y,
            boxBottom: box.rectangle.y + box.rectangle.height,
            gameObjectLeft: gameObject.rectangle.x,
            gameObjectRight: gameObject.rectangle.x + gameObject.rectangle.width,
            gameObjectTop: gameObject.rectangle.y,
            gameObjectBottom: gameObject.rectangle.y + gameObject.rectangle.height
        };
    }

    collidesInDirection(gameObject: BoundingBox): CollisionDirection {
        const edges = this.getEdges(this, gameObject);

        const offsetLeft = edges.gameObjectRight - edges.boxLeft;
        const offsetRight = edges.boxRight - edges.gameObjectLeft;
        const offsetTop = edges.gameObjectBottom - edges.boxTop;
        const offsetBottom = edges.boxBottom - edges.gameObjectTop;

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
        if (this.sprite) {
            this.sprite.x = value;
        }
    }

    get y() {
        return this.rectangle.y;
    }

    set y(value) {
        this.rectangle.y = value;
        if (this.sprite) {
            this.sprite.y = value;
        }
    }

    get width() {
        return this.rectangle.width;
    }

    set width(value) {
        this.rectangle.width = value;
        if (this.sprite) {
            this.sprite.width = value;
        }
    }

    get height() {
        return this.rectangle.height;
    }

    set height(value) {
        this.rectangle.height = value;
        if (this.sprite) {
            this.sprite.height = value;
        }
    }
    constructor(rectangle: PIXI.Rectangle) {
        this.rectangle = rectangle;
    }


    clone(): BoundingBox {
        return new BoundingBox(this.rectangle.clone());
    }

    update(box: BoundingBox): void {
        this.x = box.x;
        this.y = box.y;
        this.width = box.width;
        this.height = box.height;
    }
}

export default BoundingBox;
