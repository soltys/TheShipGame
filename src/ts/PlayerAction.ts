import LinearConvert from './common/LinearConvert';
import Keys from './common/Keys';
import * as IGame from './common/IGame';

function getGamepadActivationPoint(): number {
    return 0.25;
}


export function GetPlayerAction(context: IGame.IGameContext): IGame.IPlayerActionData[] {
    const playerActions: IGame.IPlayerActionData[] = [];
    const inputs = context.inputs;
    shouldMoveUp(inputs, playerActions);
    shouldMoveDown(inputs, playerActions);
    shouldMoveRight(inputs, playerActions);
    shouldMoveLeft(inputs, playerActions);
    shouldScaleUp(inputs, playerActions);
    shouldScaleDown(inputs, playerActions);

    return playerActions;
}

function shouldMoveUp(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const leftStick = inputs.gamepad.axes[1];
        if (leftStick < -getGamepadActivationPoint()) {

            data.push({
                action: IGame.PlayerAction.MoveUp,
                value: LinearConvert(-getGamepadActivationPoint(), -1, leftStick)
            });
            return;
        }
    }
    if (inputs.keys[Keys.UP_ARROW]) {
        data.push({
            action: IGame.PlayerAction.MoveUp,
            value: 1
        });
    }
}

function shouldMoveDown(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const leftStick = inputs.gamepad.axes[1];
        if (leftStick > getGamepadActivationPoint()) {
            data.push({
                action: IGame.PlayerAction.MoveDown,
                value: LinearConvert(getGamepadActivationPoint(), 1, leftStick)
            });
            return;
        }
    }
    if (inputs.keys[Keys.DOWN_ARROW]) {
        data.push({
            action: IGame.PlayerAction.MoveDown,
            value: 1
        });
    }
}

function shouldMoveLeft(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const button = inputs.gamepad.buttons;
        if (button && button[4] && button[4].pressed) {
            data.push({
                action: IGame.PlayerAction.MoveLeft,
                value: button[4].value
            });
            return;
        }
        const leftStick = inputs.gamepad.axes[0];
        if (leftStick < -getGamepadActivationPoint()) {
            data.push({
                action: IGame.PlayerAction.MoveLeft,
                value: LinearConvert(-getGamepadActivationPoint(), -1, leftStick)
            });
            return;
        }
    }
    if (inputs.keys[Keys.LEFT_ARROW]) {
        data.push({
            action: IGame.PlayerAction.MoveLeft,
            value: 1
        });
    }
}

function shouldMoveRight(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const button = inputs.gamepad.buttons;
        if (button && button[5] && button[5].pressed) {
            data.push({
                action: IGame.PlayerAction.MoveRight,
                value: button[5].value
            });
            return;
        }

        const leftStick = inputs.gamepad.axes[0];
        if (leftStick > getGamepadActivationPoint()) {
            data.push({
                action: IGame.PlayerAction.MoveRight,
                value: LinearConvert(getGamepadActivationPoint(), 1, leftStick)
            });
            return;
        }
    }
    if (inputs.keys[Keys.RIGHT_ARROW]) {
        data.push({
            action: IGame.PlayerAction.MoveRight,
            value: 1
        });
    }
}
function shouldScaleUp(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const button = inputs.gamepad.buttons;
        if (button && button[7] && button[7].pressed) {
            data.push({
                action: IGame.PlayerAction.ScaleUp,
                value: button[7].value
            });
            return;
        }
        if (button && button[0] && button[0].pressed) {
            data.push({
                action: IGame.PlayerAction.ScaleUp,
                value: 1
            });
            return;
        }
    }

    if (inputs.keys[Keys.KEY_W]) {
        data.push({
            action: IGame.PlayerAction.ScaleUp,
            value: 1
        });
    }
}

function shouldScaleDown(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const button = inputs.gamepad.buttons;
        if (button && button[6] && button[6].pressed) {
            data.push({
                action: IGame.PlayerAction.ScaleDown,
                value: button[6].value
            });
            return;
        }
        if (button && button[1] && button[1].pressed) {
            data.push({
                action: IGame.PlayerAction.ScaleDown,
                value: 1
            });
            return;
        }
    }
    if (inputs.keys[Keys.KEY_S]) {
        data.push({
            action: IGame.PlayerAction.ScaleDown,
            value: 1
        });
    }
}


