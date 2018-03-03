import { PlayerActionManager } from '../src/PlayerActionManager';
import { GameContextBuilder } from './builders/GameContextBuilder';
describe('PlayerActionManager', () => {
    it('PlayerActionManager object should be defined', () => {
        const contextBuilder = new GameContextBuilder();
        const context = contextBuilder.build();
        const result = PlayerActionManager.update(context);
        result.length.should.be.equal(0);
    });
});
