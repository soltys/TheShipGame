import * as IGame from '@IGame';
import Ship from './../../src/Ship';
import { GameInputsBuilder } from './GameInputsBuilder';
import * as mockito from 'ts-mockito';
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
            timerService: undefined,
            frameDeltaResolver: undefined
        };
    }

    public setInputs(config: (builder: GameInputsBuilder) => void): GameContextBuilder {
        const gameInputsBuilder = new GameInputsBuilder();
        config(gameInputsBuilder);
        this.gameContext.inputs = gameInputsBuilder.build();
        return this;
    }

    public setShip(positionX: number, positionY: number): GameContextBuilder {
        const shipMock = mockito.mock(Ship);
        const pointMock = mockito.mock(PIXI.Point);
        mockito.when(pointMock.x).thenReturn(positionX);
        mockito.when(pointMock.y).thenReturn(positionY);
        mockito.when(shipMock.position).thenReturn(mockito.instance(pointMock));
        this.gameContext.objects.ship = mockito.instance(shipMock);
        return this;
    }

    public build(): IGame.IGameContext {
        return this.gameContext;
    }


}
