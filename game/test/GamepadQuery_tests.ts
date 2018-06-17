import { GameInputsBuilder, IGamepadButtonWriteable } from './builders/GameInputsBuilder';
import { GamepadQuery } from '@core/GamepadQuery';
import { assert } from 'chai';

describe('GamepadQuery', () => {
    it('You cannot query buttons when gamepad is disconnected', () => {
        const contextBuilder = new GameInputsBuilder();
        const gamepadButton: IGamepadButtonWriteable = {
            pressed: true,
            value: 1,
            touched: false
        };
        const inputs = contextBuilder
            .setGamepadButtons([gamepadButton])
            .disconnectGamepad()
            .build();
        let neverShouldBeCalled = false;
        GamepadQuery(inputs.gamepad).queryButton(0, () => {
            neverShouldBeCalled = true;
        });

        assert.isFalse(neverShouldBeCalled);
    });
});
