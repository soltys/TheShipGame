import BoundingBox from './BoundingBox';
import CollisionDirection from './CollisionDirection';
import * as IGame from './IGame';
export default class GameObject implements IGame.IGameObject {
    init(state: IGame.IGameContext): void {

    }
    update(delta: number, state: IGame.IGameContext): void {

    }
    collideWith(boundingBox: BoundingBox): IGame.ICollisionData {
        const data: IGame.ICollisionData = {
            isColliding: false,
            direction: CollisionDirection.Unknown,
            name: '',
            collisionBox: null
        };
        return data;
    }

    checkCollision(me: BoundingBox, boundingBox: BoundingBox): { isColliding: boolean; direction: CollisionDirection; collisionBox: BoundingBox } {
        let data = { isColliding: false, direction: CollisionDirection.Unknown, collisionBox: null };
        if (me.collidesWith(boundingBox)) {
            data.direction = me.collidesInDirection(me, boundingBox);
            data.isColliding = true;
            data.collisionBox = me;
            return data;
        }
        return data;
    }
}

