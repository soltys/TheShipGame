import { PlayerActionManager } from '../src/PlayerActionManager';
import { GameContextBuilder } from './builders/GameContextBuilder';
describe('PlayerActionManager', () => {
    it('PlayerActionManager object should be defined', () => {


        const contextBuilder = new GameContextBuilder();
        const context = contextBuilder
            .setInputs(inputsBuilder =>
                inputsBuilder.addTouch(1, 2, 3))
            .build();
        console.log(context);
        const result = PlayerActionManager.update(context);

        console.log(result);

        const value = 42;

        value.should.be.equals(41);
    });


});
