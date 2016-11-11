declare namespace ThisGame {

    interface IGameState {
        keys: Object;
        clicks: Object;
        mouse: IMousePosition;
        objects: Array<IGameObject>;
    }

    interface IMousePosition {
        clientX: number;
        clientY: number;
    }

    interface IGameObject {
        update(delta: number, state: IGameState): void;
    }

    interface IGameDisplayObject extends IGameObject {
        readonly displayObject: PIXI.DisplayObject
    }

    interface IDictionary {
        add(key: string, value: any): void;
        remove(key: string): void;
        containsKey(key: string): boolean;
        keys(): string[];
        values(): any[];
    }


}