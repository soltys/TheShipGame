import * as _ from 'lodash';
import * as IGame from './IGame';
import { Keys } from 'game-core';
import LinearConverter from './LinearConverter';
import MouseButtons from './MouseButtons';
import { PlayerActionType as PA } from 'game-base';


export class PlayerActionManager {
    private static gamepadActivationPoint = 0.25;
    private static gameContext: IGame.IGameContext;

    private static get ship(): IGame.IShip {
        return this.gameContext.objects.ship;
    }

    public static update(context: IGame.IGameContext): IGame.IPlayerActionData[] {
        this.gameContext = context;
        const playerActions: IGame.IPlayerActionData[] = [];
        const inputs = _.cloneDeep(context.inputs);

        if (inputs.touches.length > 0) {
            inputs.mouse = inputs.touches[0];
            inputs.clicks[MouseButtons.LEFT_BUTTON] = inputs.touches[0];
        }

        this.shouldMoveUp(inputs, playerActions);
        this.shouldMoveDown(inputs, playerActions);
        this.shouldMoveRight(inputs, playerActions);
        this.shouldMoveLeft(inputs, playerActions);
        this.shouldScaleUp(inputs, playerActions);
        this.shouldScaleDown(inputs, playerActions);

        if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
            this.mouseSpeedFix(playerActions);
        } else {
            const diagonalPairs: [PA, PA][] = [
                [PA.MoveUp, PA.MoveLeft],
                [PA.MoveUp, PA.MoveRight],
                [PA.MoveDown, PA.MoveLeft],
                [PA.MoveDown, PA.MoveRight]
            ];
            this.diagonalSpeedFix(playerActions, diagonalPairs);
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
    private static diagonalSpeedFix(data: IGame.IPlayerActionData[], diagonalPairs: [PA, PA][]): void {
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

    /**
     * Simillar to diagonal diagonalSpeedFix
     * @param data
     */
    private static mouseSpeedFix(data: IGame.IPlayerActionData[]) {
        const location = this.gameContext.inputs.mouse;
        const deltaY = Math.abs(location.y - this.ship.position.y);
        const deltaX = Math.abs(location.x - this.ship.position.x);
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

    private static shouldMoveUp(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
        if (inputs.gamepad.isConnected) {
            const leftStick = inputs.gamepad.axes[1];
            if (leftStick < -this.gamepadActivationPoint) {
                data.push({
                    action: PA.MoveUp,
                    value: LinearConverter(-this.gamepadActivationPoint, -1, leftStick)
                });
                return;
            }
        }
        if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
            const location = inputs.mouse;
            if (location.y < this.ship.position.y) {
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

    private static shouldMoveDown(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
        if (inputs.gamepad.isConnected) {
            const leftStick = inputs.gamepad.axes[1];
            if (leftStick > this.gamepadActivationPoint) {
                data.push({
                    action: PA.MoveDown,
                    value: LinearConverter(this.gamepadActivationPoint, 1, leftStick)
                });
                return;
            }
        }
        if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
            const location = inputs.mouse;
            if (location.y > this.ship.position.y) {
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

    private static shouldMoveLeft(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
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
            if (leftStick < -this.gamepadActivationPoint) {
                data.push({
                    action: PA.MoveLeft,
                    value: LinearConverter(-this.gamepadActivationPoint, -1, leftStick)
                });
                return;
            }
        }

        if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
            const location = inputs.mouse;
            if (location.x < this.ship.position.x) {
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

    private static shouldMoveRight(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
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
            if (leftStick > this.gamepadActivationPoint) {
                data.push({
                    action: PA.MoveRight,
                    value: LinearConverter(this.gamepadActivationPoint, 1, leftStick)
                });
                return;
            }
        }

        if (inputs.clicks[MouseButtons.LEFT_BUTTON]) {
            const location = inputs.mouse;
            if (location.x > this.ship.position.x) {
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
    private static shouldScaleUp(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
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

    private static shouldScaleDown(inputs: IGame.IGameInput, data: IGame.IPlayerActionData[]): void {
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

}
