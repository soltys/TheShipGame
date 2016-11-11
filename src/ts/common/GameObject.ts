import BoundingBox from './BoundingBox';
import * as Game from './IGame';
export default class GameObject implements Game.IGameObject {
    update(delta: number, state: Game.IGameState): void {

    }
    collideWith(boundingBox: BoundingBox): Game.ICollisionData {
        var data: Game.ICollisionData = {
            isColliding: false,
            direction: Game.CollisionDirection.Unknown,
            name: ""
        }
        return data;
    }
}

