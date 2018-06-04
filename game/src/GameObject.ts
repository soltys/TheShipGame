import BoundingBox from './BoundingBox';
import { CollisionDirection } from '@core/CollisionDirection';
import * as IGame from './IGame';
export default class GameObject implements IGame.IGameObject {
    init(state: IGame.IGameContext): void {

    }
    update(delta: number, state: IGame.IGameContext): void {

    }
    collideWith(boundingBox: IGame.IBoundingBox): IGame.ICollisionData {
        const data: IGame.ICollisionData = {
            isColliding: false,
            direction: CollisionDirection.Unknown,
            name: '',
            collisionBox: undefined
        };
        return data;
    }

    checkCollision(me: IGame.IBoundingBox, boundingBox: IGame.IBoundingBox): { isColliding: boolean; direction: CollisionDirection; collisionBox: BoundingBox } {
        const data = { isColliding: false, direction: CollisionDirection.Unknown, collisionBox: undefined };
        if (me.collidesWith(boundingBox)) {
            data.direction = me.collidesInDirection(boundingBox);
            data.isColliding = true;
            data.collisionBox = me;
            return data;
        }
        return data;
    }
}

