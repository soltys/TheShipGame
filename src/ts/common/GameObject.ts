import BoundingBox from './BoundingBox';
export default class GameObject implements IGameObject {
    update(delta: number, state: IGameState): void {

    }
    collideWith(boundingBox: BoundingBox): boolean {
        return false;
    }
}