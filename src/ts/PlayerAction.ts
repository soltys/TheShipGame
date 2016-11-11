import Keys from './common/Keys';

export enum PlayerAction {
    MoveUp,
    MoveDown,
    MoveRight,
    MoveLeft,

    ScaleUp,
    ScaleDown,
}
function approxeq(v1: number, v2: number, epsilon?: number): boolean {
    if (epsilon == null) {
        epsilon = 0.001;
    }
    return Math.abs(v1 - v2) < epsilon;
};
export function GetPlayerAction(state: IGameState): PlayerAction[] {
    const playerActions: PlayerAction[] = [];

    if (shouldMoveUp(state)) {
        playerActions.push(PlayerAction.MoveUp);
    }

    if (shouldMoveDown(state)) {
        playerActions.push(PlayerAction.MoveDown);
    }

    if (shouldMoveRight(state)) {
        playerActions.push(PlayerAction.MoveRight);
    }

    if (shouldMoveLeft(state)) {
        playerActions.push(PlayerAction.MoveLeft);
    }

    if (shouldScaleUp(state)) {
        playerActions.push(PlayerAction.ScaleUp);
    }
    if (shouldScaleDown(state)) {
        playerActions.push(PlayerAction.ScaleDown);
    }

    return playerActions;
}

function shouldMoveUp(state: IGameState): boolean {
    if (state.gamepad.isConnected) {
         const leftStick = state.gamepad.axes[1];
        if (leftStick < -0.3) {
            return true;
        }
    }
    return state.keys[Keys.UP_ARROW]
}

function shouldMoveDown(state: IGameState): boolean {
    if (state.gamepad.isConnected) {
         const leftStick = state.gamepad.axes[1];
        if (leftStick > 0.3) {
            return true;
        }
    }
    return state.keys[Keys.DOWN_ARROW]
}

function shouldMoveLeft(state: IGameState): boolean {
    if (state.gamepad.isConnected) {
         const leftStick = state.gamepad.axes[0];
        if (leftStick < -0.3) {
            return true;
        }
    }
    return state.keys[Keys.LEFT_ARROW]
}

function shouldMoveRight(state: IGameState): boolean {
    if (state.gamepad.isConnected) {
         const leftStick = state.gamepad.axes[0];
        if (leftStick > 0.3) {
            return true;
        }
    }
    return state.keys[Keys.RIGHT_ARROW]
}
function shouldScaleUp(state: IGameState): boolean {
    if (state.gamepad.isConnected) {
        const button = state.gamepad.buttons;
        if (button && button[0] && button[0].pressed) {
            return true;
        }
    }

    return state.keys[Keys.KEY_W]
}

function shouldScaleDown(state: IGameState): boolean {
    if (state.gamepad.isConnected) {
        const button = state.gamepad.buttons;
        if (button && button[1] && button[1].pressed) {
            return true;
        }
    }
    return state.keys[Keys.KEY_S]
}


