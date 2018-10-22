import { PlayerActionManager } from '../src/PlayerActionManager';
import { GameContextBuilder } from './builders/GameContextBuilder';
import { assert } from 'chai';
import { PlayerActionType } from '@core/PlayerActionType';

describe('PlayerActionManager', () => {
    it('PlayerActionManager object should be defined', () => {
        const contextBuilder = new GameContextBuilder();
        const context = contextBuilder.build();
        const result = PlayerActionManager.update(context);
        result.length.should.be.equal(0);
    });
    describe('Gamepad', () => {
        it('Pressing button of index one should produce ScaleUp', () => {
            const contextBuilder = new GameContextBuilder();
            const context = contextBuilder
                .setInputs((inputsBuilder) => {
                    inputsBuilder
                        .connectGamepad()
                        .setGamepadButtons([{
                            pressed: true,
                            value: 1,
                            touched: false
                        }]);
                }).build();
            const result = PlayerActionManager.update(context);
            assert.lengthOf(result, 1);
            assert.equal(PlayerActionType.ScaleUp, result[0].action);
        });
    });
});
