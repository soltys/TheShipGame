import * as IGame from '@IGame';

interface IGamepadQueryButtonValue {
    (value: number): void;
}

interface IGamepadQueryStickValue {
    (stickValue: number): void;
}

interface IGamepadQueryAxisButtons {
    queryButton(index: number, method: IGamepadQueryButtonValue): IGamepadQueryAxisButtons;
    queryStick(index: number, activationPoint: number, method: IGamepadQueryButtonValue): IGamepadQueryAxisButtons;
}
export function GamepadQuery(gamepadData: IGame.IGamepadData): IGamepadQueryAxisButtons {
    return CreateGamepadQueryActions(gamepadData);
}

function CreateGamepadQueryActions(gamepadData: IGame.IGamepadData): IGamepadQueryAxisButtons {
    if (gamepadData.isConnected) {
        return {
            queryButton: (index, method) => {
                return queryButton(gamepadData, index, method);
            },
            queryStick: (index, activationPoint, method) => {
                return queryStick(gamepadData, index, activationPoint, method);
            }
        };
    } else {
        return CreateEmptyActions();
    }
}

function CreateEmptyActions(): IGamepadQueryAxisButtons {
    return {
        queryButton: () => { return CreateEmptyActions(); },
        queryStick: () => { return CreateEmptyActions(); }
    };
}

function queryButton(gamepadData: IGame.IGamepadData, index: number, method: IGamepadQueryButtonValue): IGamepadQueryAxisButtons {
    const buttons = gamepadData.buttons;
    if (buttons && buttons[index] && buttons[index].pressed) {
        method(buttons[index].value);
    }
    return CreateGamepadQueryActions(gamepadData);
}

function queryStick(gamepadData: IGame.IGamepadData, index: number, activationPoint: number, method: IGamepadQueryStickValue): IGamepadQueryAxisButtons {
    const axes = gamepadData.axes;
    const stick = axes[index];
    if (stick < activationPoint) {
        method(stick);
    }
    return CreateGamepadQueryActions(gamepadData);
}
