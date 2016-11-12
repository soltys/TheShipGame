import LinearConvert from './common/LinearConvert';
import Keys from './common/Keys';
import * as IGame from './common/IGame';

function approxeq(v1: number, v2: number, epsilon?: number): boolean {
    if (epsilon == null) {
        epsilon = 0.001;
    }
    return Math.abs(v1 - v2) < epsilon;
};

function getGamepadActivationPoint(): number {
    return 0.25;
}


export function GetPlayerAction(state: IGame.IGameState): IGame.IPlayerActionData[] {
    const playerActions: IGame.IPlayerActionData[] = [];

    shouldMoveUp(state, playerActions);
    shouldMoveDown(state, playerActions);
    shouldMoveRight(state, playerActions);
    shouldMoveLeft(state, playerActions);
    shouldScaleUp(state, playerActions);
    shouldScaleDown(state, playerActions);

    return playerActions;
}

function shouldMoveUp(state: IGame.IGameState, data: IGame.IPlayerActionData[]): void {
    if (state.gamepad.isConnected) {
        const leftStick = state.gamepad.axes[1];
        if (leftStick < -getGamepadActivationPoint()) {

            data.push({
                action: IGame.PlayerAction.MoveUp,
                value: LinearConvert(-getGamepadActivationPoint(), -1, leftStick)
            });
            return;
        }
    }
    if (state.keys[Keys.UP_ARROW]) {
        data.push({
            action: IGame.PlayerAction.MoveUp,
            value: 1
        });
    }
}

function shouldMoveDown(state: IGame.IGameState, data: IGame.IPlayerActionData[]): void {
    if (state.gamepad.isConnected) {
        const leftStick = state.gamepad.axes[1];
        if (leftStick > getGamepadActivationPoint()) {
            data.push({
                action: IGame.PlayerAction.MoveDown,
                value: LinearConvert(getGamepadActivationPoint(), 1, leftStick)
            });
            return;
        }
    }
    if (state.keys[Keys.DOWN_ARROW]) {
        data.push({
            action: IGame.PlayerAction.MoveDown,
            value: 1
        });
    }
}

function shouldMoveLeft(state: IGame.IGameState, data: IGame.IPlayerActionData[]): void {
    if (state.gamepad.isConnected) {
        const button = state.gamepad.buttons;
        if (button && button[4] && button[4].pressed) {
            data.push({
                action: IGame.PlayerAction.MoveLeft,
                value: button[4].value
            });
            return;
        }
        const leftStick = state.gamepad.axes[0];
        if (leftStick < -getGamepadActivationPoint()) {
            data.push({
                action: IGame.PlayerAction.MoveLeft,
                value: LinearConvert(-getGamepadActivationPoint(), -1, leftStick)
            });
            return;
        }
    }
    if (state.keys[Keys.LEFT_ARROW]) {
        data.push({
            action: IGame.PlayerAction.MoveLeft,
            value: 1
        });
    }
}

function shouldMoveRight(state: IGame.IGameState, data: IGame.IPlayerActionData[]): void {
    if (state.gamepad.isConnected) {
        const button = state.gamepad.buttons;
        if (button && button[5] && button[5].pressed) {
            data.push({
                action: IGame.PlayerAction.MoveRight,
                value: button[5].value
            });
            return;
        }

        const leftStick = state.gamepad.axes[0];
        if (leftStick > getGamepadActivationPoint()) {
            data.push({
                action: IGame.PlayerAction.MoveRight,
                value: LinearConvert(getGamepadActivationPoint(), 1, leftStick)
            });
            return;
        }
    }
    if (state.keys[Keys.RIGHT_ARROW]) {
        data.push({
            action: IGame.PlayerAction.MoveRight,
            value: 1
        });
    }
}
function shouldScaleUp(state: IGame.IGameState, data: IGame.IPlayerActionData[]): void {
    if (state.gamepad.isConnected) {
        const button = state.gamepad.buttons;
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

    if (state.keys[Keys.KEY_W]) {
        data.push({
            action: IGame.PlayerAction.ScaleUp,
            value: 1
        });
    }
}

function shouldScaleDown(state: IGame.IGameState, data: IGame.IPlayerActionData[]): void {
    if (state.gamepad.isConnected) {
        const button = state.gamepad.buttons;
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
    if (state.keys[Keys.KEY_S]) {
        data.push({
            action: IGame.PlayerAction.ScaleDown,
            value: 1
        });
    }
}


