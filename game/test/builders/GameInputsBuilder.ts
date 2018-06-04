import * as IGame from './../../src/IGame';
import { Keys } from '@core/Keys';
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
            gamepad: { isConnected: false, axes: undefined, buttons: undefined }
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

    public setGamepad(axes: number[], buttons: GamepadButton[]): GameInputsBuilder {
        this.gameInputs.gamepad.isConnected = true;
        this.gameInputs.gamepad.axes = axes;
        this.gameInputs.gamepad.buttons = buttons;
        return this;
    }


    public build(): IGame.IGameInput {
        return this.gameInputs;
    }
}
