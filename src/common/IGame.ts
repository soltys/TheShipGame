import CollisionDirection from './CollisionDirection';
import PlayerAction from './PlayerAction';

export interface IBoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IHost {
    stage: PIXI.Container;
    removeObject(gameObject: IGameObject): void;
    addObject(gameObject: IGameObject): void;
    gotoState(state: IGameState): void;

    gameHeight: number;
    gameWidth: number;
}

export interface IConfig{
    isMouseEnabled: boolean;
}

export interface IShip {
    position: PIXI.Point;
}

export interface IGameState {
    handle(context: IGameContext): void;
    onLeave(context: IGameContext): void;
}

export interface IScore {
    addToScore(value: number): void;
}

export interface IPlayerActionData {
    action: PlayerAction;
    value: number;
}
export interface IGameContext {
    inputs: IGameInput;
    objects: IGameObjectCollection;
    game: IHost;

    state: IGameState;
}
export interface IGameInput {
    keys: { [index: number]: boolean };
    clicks: { [index: number]: IMousePosition };
    wheel: IMouseWheel;
    mouse: IMousePosition;
    gamepad: IGamepadData;
}

export interface IGameObjectCollection {
    all: Array<IGameObject>;
    score: IScore;
    ship: IShip;
}


export interface IMousePosition {
    clientX: number;
    clientY: number;
}


export interface IMouseWheel {
    deltaX: number;
    deltaY: number;
    deltaZ: number;
}

export interface IGamepadData {
    buttons: GamepadButton[];
    isConnected: boolean;
    axes: number[];

}

export interface ICollisionData {
    name: string;
    isColliding: boolean;
    direction: CollisionDirection;
    collisionBox: IBoundingBox;
}

export interface IGameObject {
    init(state: IGameContext): void;
    update(delta: number, state: IGameContext): void;
    collideWith(boundingBox: IBoundingBox): ICollisionData;
}

export interface IGameDisplayObject extends IGameObject {
    readonly displayObjects: PIXI.DisplayObject[];
}

export interface IDictionary {
    add(key: string, value: any): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    keys(): string[];
    values(): any[];
}
