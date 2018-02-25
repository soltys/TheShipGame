import * as IGame from './../../src/IGame';
export class GameInputsBuilder {
    private gameInputs: IGame.IGameInput;
    constructor() {
        this.gameInputs = {
            keys: undefined,
            clicks: {},
            wheel: undefined,
            mouse: undefined,
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

    public setGamepad(axes: number[], buttons: GamepadButton[]) {
        this.gameInputs.gamepad.isConnected = true;
        this.gameInputs.gamepad.axes = axes;
        this.gameInputs.gamepad.buttons = buttons;
    }


    public build(): IGame.IGameInput {
        return this.gameInputs;
    }
}
