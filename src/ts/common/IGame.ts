declare class BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

declare class Game {
    stage: PIXI.Container;
    removeObject(gameObject: IGameObject): void;
    addObject(gameObject: IGameObject): void;
    gotoState(state: IGameState): void;

    gameHeight: number;
    gameWidth: number;
}

declare class Ship{
    position:PIXI.Point;
}

export interface IGameState {
    handle(context: IGameContext): void;
    onLeave(context: IGameContext): void;
}

declare class Score {
    public addToScore(value: number): void;
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

export interface IPlayerActionData {
    action: PlayerAction;
    value: number;
}
export interface IGameContext {
    inputs: IGameInput;
    objects: IGameObjectCollection;
    game: Game;

    state: IGameState;
}
export interface IGameInput {
    keys: {[index: number]: boolean};
    clicks: {[index: number]:IMousePosition };
    mouse:  IMousePosition;
    gamepad: IGamepadData;
}

export interface IGameObjectCollection {
    all: Array<IGameObject>;
    score: Score;
    ship: Ship;
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
    name: string;
    isColliding: boolean;
    direction: CollisionDirection;
    collisionBox: BoundingBox;
}

export interface IGameObject {
    init(state: IGameContext): void;
    update(delta: number, state: IGameContext): void;
    collideWith(boundingBox: BoundingBox): ICollisionData;
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


