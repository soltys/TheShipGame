import BoundingBox from './BoundingBox';
import * as IGame from './IGame';
export default class GameObject implements IGame.IGameObject {
    init(state: IGame.IGameState): void {

    }
    update(delta: number, state: IGame.IGameState): void {

    }
    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        var data: IGame.ICollisionData = {
            isColliding: false,
            direction: IGame.CollisionDirection.Unknown,
            name: "",
            collisionBox: null
        }
        return data;
    }

    checkCollision(me: BoundingBox, boundingBox: BoundingBox): { isColliding: boolean; direction: IGame.CollisionDirection; collisionBox: BoundingBox } {
        let data = { isColliding: false, direction: IGame.CollisionDirection.Unknown, collisionBox: null };
        if (me.collidesWith(boundingBox)) {
            data.direction = me.collidesInDirection(me, boundingBox);
            data.isColliding = true;
            data.collisionBox = me;
            return data;
        }
        return data;
    }
}

