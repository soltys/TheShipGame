import * as IGame from '@IGame';
import { Keys } from '@core/Keys';

export interface IGamepadButtonWriteable {
    pressed: boolean;
    value: number;
    touched: boolean;
}

export class GameInputsBuilder {
    private gameInputs: IGame.IGameInput;
    constructor() {
        this.gameInputs = {
            keys: {},
            clicks: {},
            wheel: undefined,
            mouse: {
                x: undefined,
                y: undefined
            },
            touches: [],
            gamepad: { isConnected: false, axes: [], buttons: [] }
        };
    }

    public addTouch(id: number, x: number, y: number): GameInputsBuilder {
        const touch: IGame.ITouch = {
            id: id,
            x: x,
            y: y
        };
        this.gameInputs.touches.push(touch);
        return this;
    }

    public addKey(key: Keys, isPressed: boolean): GameInputsBuilder {
        this.gameInputs.keys[key] = isPressed;
        return this;
    }

    private changeGamepadConnection(value: boolean) {
        this.gameInputs.gamepad.isConnected = value;
    }

    public connectGamepad(): GameInputsBuilder {
        this.changeGamepadConnection(true);
        return this;
    }

    public disconnectGamepad(): GameInputsBuilder {
        this.changeGamepadConnection(false);
        return this;
    }


    public setGamepadButtons(buttons: IGamepadButtonWriteable[]): GameInputsBuilder {
        this.gameInputs.gamepad.buttons = buttons;
        return this;
    }

    public setGamepadAxis(axes: number[]): GameInputsBuilder {
        this.gameInputs.gamepad.axes = axes;
        return this;
    }

    public build(): IGame.IGameInput {
        return this.gameInputs;
    }
}
