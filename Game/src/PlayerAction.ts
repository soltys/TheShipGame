import * as _ from 'lodash';
import * as IGame from './IGame';
import { Keys } from 'game-support';
import LinearConverter from './LinearConverter';
import MouseButtons from './MouseButtons';
import PA from './PlayerActionType';

const gamepadActivationPoint = 0.25;

let gameContext: IGame.IGameContext;
export function GetPlayerAction(context: IGame.IGameContext): IGame.IPlayerActionData[] {
    gameContext = context;
    const playerActions: IGame.IPlayerActionData[] = [];
    const inputs = _.cloneDeep(context.inputs);

    if (inputs.touches.length > 0) {
        inputs.mouse = inputs.touches[0];
        inputs.clicks[MouseButtons.LEFT_BUTTON] = inputs.touches[0];
    }

    shouldMoveUp(inputs, playerActions);
    shouldMoveDown(inputs, playerActions);
    shouldMoveRight(inputs, playerActions);
    shouldMoveLeft(inputs, playerActions);
    shouldScaleUp(inputs, playerActions);
    shouldScaleDown(inputs, playerActions);

    if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
        mouseSpeedFix(playerActions);
    } else {
        const diagonalPairs: [PA, PA][] = [
            [PA.MoveUp, PA.MoveLeft],
            [PA.MoveUp, PA.MoveRight],
            [PA.MoveDown, PA.MoveLeft],
            [PA.MoveDown, PA.MoveRight]
        ];
        diagonalSpeedFix(playerActions, diagonalPairs);
    }

    return playerActions;
}

/**
 * When player moves diagonal with speed of 1 in both directions, then player moves at sqrt(2). To limit that
 * Player should move at sqrt(1/2) ~= 0.70710678118
 *
 * @param {IGame.IPlayerActionData[]} data
 * @param {[PA, PA][]} diagonalPairs
 */
function diagonalSpeedFix(data: IGame.IPlayerActionData[], diagonalPairs: [PA, PA][]): void {
    const speedFix = 0.707;
    diagonalPairs.forEach(pair => {
        const data1 = _.find(data, ['action', pair[0]]);
        const data2 = _.find(data, ['action', pair[1]]);
        if (data1 && data2) {
            if (data1.value === 1 && data2.value === 1) {
                data1.value = speedFix;
                data2.value = speedFix;
            }
        }
    });

}

function mouseSpeedFix(data: IGame.IPlayerActionData[]) {
    const location = gameContext.inputs.mouse;
    const deltaY = Math.abs(location.clientY - gameContext.objects.ship.position.y);
    const deltaX = Math.abs(location.clientX - gameContext.objects.ship.position.x);
    const vectorLength = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    for (const entry of data) {
        switch (entry.action) {
            case PA.MoveUp:
                entry.value = deltaY / vectorLength;
                break;
            case PA.MoveDown:
                entry.value = deltaY / vectorLength;
                break;
            case PA.MoveLeft:
                entry.value = deltaX / vectorLength;
                break;
            case PA.MoveRight:
                entry.value = deltaX / vectorLength;
                break;
        }
    }
}

function shouldMoveUp(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const leftStick = inputs.gamepad.axes[1];
        if (leftStick < -gamepadActivationPoint) {
            data.push({
                action: PA.MoveUp,
                value: LinearConverter(-gamepadActivationPoint, -1, leftStick)
            });
            return;
        }
    }
    if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
        const location = inputs.mouse;
        if (location.clientY < gameContext.objects.ship.position.y) {
            data.push({
                action: PA.MoveUp,
                value: 1
            });
        }
    }

    if (inputs.keys[Keys.UP_ARROW]) {
        data.push({
            action: PA.MoveUp,
            value: 1
        });
    }
}

function shouldMoveDown(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const leftStick = inputs.gamepad.axes[1];
        if (leftStick > gamepadActivationPoint) {
            data.push({
                action: PA.MoveDown,
                value: LinearConverter(gamepadActivationPoint, 1, leftStick)
            });
            return;
        }
    }
    if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
        const location = inputs.mouse;
        if (location.clientY > gameContext.objects.ship.position.y) {
            data.push({
                action: PA.MoveDown,
                value: 1
            });
        }

    }
    if (inputs.keys[Keys.DOWN_ARROW]) {
        data.push({
            action: PA.MoveDown,
            value: 1
        });
    }
}

function shouldMoveLeft(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const button = inputs.gamepad.buttons;
        // bumpers for ship strafing
        if (button && button[4] && button[4].pressed) {
            data.push({
                action: PA.MoveLeft,
                value: button[4].value
            });
            return;
        }
        const leftStick = inputs.gamepad.axes[0];
        if (leftStick < -gamepadActivationPoint) {
            data.push({
                action: PA.MoveLeft,
                value: LinearConverter(-gamepadActivationPoint, -1, leftStick)
            });
            return;
        }
    }

    if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
        const location = inputs.mouse;
        if (location.clientX < gameContext.objects.ship.position.x) {
            data.push({
                action: PA.MoveLeft,
                value: 1
            });
        }

    }

    if (inputs.keys[Keys.LEFT_ARROW]) {
        data.push({
            action: PA.MoveLeft,
            value: 1
        });
    }
}

function shouldMoveRight(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const button = inputs.gamepad.buttons;
        // bumpers for ship strafing
        if (button && button[5] && button[5].pressed) {
            data.push({
                action: PA.MoveRight,
                value: button[5].value
            });
            return;
        }

        const leftStick = inputs.gamepad.axes[0];
        if (leftStick > gamepadActivationPoint) {
            data.push({
                action: PA.MoveRight,
                value: LinearConverter(gamepadActivationPoint, 1, leftStick)
            });
            return;
        }
    }

    if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
        const location = inputs.mouse;
        if (location.clientX > gameContext.objects.ship.position.x) {
            data.push({
                action: PA.MoveRight,
                value: 1
            });
        }

    }

    if (inputs.keys[Keys.RIGHT_ARROW]) {
        data.push({
            action: PA.MoveRight,
            value: 1
        });
    }
}
function shouldScaleUp(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const button = inputs.gamepad.buttons;
        // using gamepad triggers
        if (button && button[7] && button[7].pressed) {
            data.push({
                action: PA.ScaleUp,
                value: button[7].value
            });
            return;
        }
        if (button && button[0] && button[0].pressed) {
            data.push({
                action: PA.ScaleUp,
                value: 1
            });
            return;
        }
    }
    if (inputs.wheel && inputs.wheel.deltaY < 0) {
        data.push({
            action: PA.ScaleUp,
            value: 1
        });

        delete inputs.wheel;
    }
    if (inputs.keys[Keys.KEY_W]) {
        data.push({
            action: PA.ScaleUp,
            value: 1
        });
    }
}

function shouldScaleDown(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
    if (inputs.gamepad.isConnected) {
        const button = inputs.gamepad.buttons;
        // using gamepad triggers
        if (button && button[6] && button[6].pressed) {
            data.push({
                action: PA.ScaleDown,
                value: button[6].value
            });
            return;
        }
        if (button && button[1] && button[1].pressed) {
            data.push({
                action: PA.ScaleDown,
                value: 1
            });
            return;
        }
    }
    if (inputs.wheel && inputs.wheel.deltaY > 0) {
        data.push({
            action: PA.ScaleDown,
            value: 1
        });
        delete inputs.wheel;
    }
    if (inputs.keys[Keys.KEY_S]) {
        data.push({
            action: PA.ScaleDown,
            value: 1
        });
    }
}
