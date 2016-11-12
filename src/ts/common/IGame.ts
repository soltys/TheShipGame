declare class BoundingBox {

}

declare class Game {

}

export class Colors {
    static get GameBorder(): number {
        return 0xFF00BB;
    }

    static get Background(): number {
        return 0x1099bb;
    }

    static get TextColor(): string {
        return '#eee';
    }

    static get TextOutlineColor(): string {
        return '#000';
    }
}

export enum CollisionDirection {
    Unknown,
    Up,
    Down,
    Left,
    Right
}

export enum PlayerAction {
    MoveUp,
    MoveDown,
    MoveRight,
    MoveLeft,

    ScaleUp,
    ScaleDown,
}

export interface IPlayerActionData{
    action: PlayerAction;
    value: number;
}
export interface IGameState {
    keys: Object;
    clicks: Object;
    mouse: IMousePosition;
    objects: Array<IGameObject>;
    gamepad: IGamepadData;

    debugSTAGE: any;
    game: Game;
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


