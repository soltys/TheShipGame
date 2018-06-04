import * as PIXI from 'pixi.js';
import Colors from './Colors';
import { DisplayLayer } from '@core/DisplayLayer';
import GameObject from './GameObject';
import * as IGame from './IGame';
import StartGame from './input/Menu';
import PlayState from './state/PlayState';
export default class Menu extends GameObject implements IGame.IGameDisplayObject {
    private startDisplay: PIXI.Text;
    private textStyle: Object;

    constructor(gameWidth: number, gameHeight: number) {
        super();

        this.textStyle = {
            fontFamily: 'Fira Sans',
            fontSize: '42px',
            fontWeight: 'bold',
            fill: Colors.TextColor,
            stroke: Colors.TextOutlineColor,
            strokeThickness: 2
        };
        this.startDisplay = new PIXI.Text('Start', this.textStyle);
        this.startDisplay.x = gameWidth / 2 - this.startDisplay.width / 2;
        this.startDisplay.y = gameHeight / 2 - this.startDisplay.height / 2;
    }

    public update(deltaTime: number, context: IGame.IGameContext): void {
        if (StartGame(context)) {
            context.game.gotoState(new PlayState());
        }
    }

    get displayObjects(): PIXI.DisplayObject[] {
        return [this.startDisplay];
    }

    get displayLayer(): DisplayLayer {
        return DisplayLayer.Main;
    }
}
