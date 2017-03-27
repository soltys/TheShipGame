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
    animate(): void;
    pause(): void;

    gameHeight: number;
    gameWidth: number;
}

export interface IConfig {
    readonly isMouseEnabled: boolean;
    readonly showFPSCounter: boolean;
}

export interface IShip extends IGameObject {
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
    timerService: ITimerService;
}
export interface IGameInput {
    keys: { [index: number]: boolean };
    clicks: { [index: number]: IPosition };
    wheel: IMouseWheel;
    mouse: IPosition;
    touches: ITouch[];
    gamepad: IGamepadData;
}
export interface ITouch extends IPosition {
    id: number;
}

export interface IGameObjectCollection {
    all: Array<IGameObject>;
    score: IScore;
    ship: IShip;
    borders: IGameObject[];
}


export interface IPosition {
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

export interface ITimerService {
    /**
     * Adds new timer to checking
     *
     * @param {ITimer} timer
     *
     * @memberOf ITimerService
     */
    add(timer: ITimer);
}
export interface ITimer {
    /**
    * Time when should next action accour, if you want as soon
    *
    * @type {number}
    * @memberOf ITimer
    */
    nextFireTime: number;

    /**
     * Launches action specified in timer
     *
     * @param {number} currentTime
     *
     * @memberOf ITimer
     */
    triggerAction(currentTime: number);
}

export interface IConfigUpdated {
    key: string;
    newValue: any;
    oldValue: any;
}
