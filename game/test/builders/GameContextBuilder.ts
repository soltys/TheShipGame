import * as IGame from './../../src/IGame';
import { GameInputsBuilder } from './GameInputsBuilder';
export class GameContextBuilder {
    private gameContext: IGame.IGameContext;
    constructor() {
        this.gameContext = {
            inputs: undefined,
            objects: {
                all: [],
                score: undefined,
                ship: undefined,
                pauseOverlay: undefined,
                borders: undefined
            },
            game: undefined,
            state: undefined,
            timerService: undefined
        };
    }

    public setInputs(config: (builder: GameInputsBuilder) => void): GameContextBuilder {
        const gameInputsBuilder = new GameInputsBuilder();
        config(gameInputsBuilder);
        this.gameContext.inputs = gameInputsBuilder.build();
        return this;
    }

    public setShip(): GameContextBuilder {

        return this;
    }

    public build(): IGame.IGameContext {
        return this.gameContext;
    }


}
