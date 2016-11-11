declare class BoundingBox {

}

export enum CollisionDirection {
    Unknown,
    Up,
    Down,
    Left,
    Right
}
export interface IGameState {
    keys: Object;
    clicks: Object;
    mouse: IMousePosition;
    objects: Array<IGameObject>;
    gamepad: IGamepadData;

    debugSTAGE: any;
}

export interface IMousePosition {
    clientX: number;
    clientY: number;
}

export interface IGamepadData {
    buttons: GamepadButton[];
    isConnected: boolean;
    axes: number[];

}

export interface ICollisionData {
    name: string,
    isColliding: boolean,
    direction: CollisionDirection

}

export interface IGameObject {
    update(delta: number, state: IGameState): void;
    collideWith(boundingBox: BoundingBox): ICollisionData;
}

export interface IGameDisplayObject extends IGameObject {
    readonly displayObject: PIXI.DisplayObject
}

export interface IDictionary {
    add(key: string, value: any): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    keys(): string[];
    values(): any[];
}


