import * as PIXI from 'pixi.js';
import Colors from './common/Colors';
import GameObject from './common/GameObject';
import * as IGame from './common/IGame';
import Keys from './common/Keys';
import PlayState from './state/PlayState';
export default class Menu extends GameObject implements IGame.IGameDisplayObject {
    private startDisplay: PIXI.Text;
    private textStyle: Object;

    constructor(gameWidth: number, gameHeight: number) {
        super();

        this.textStyle = {
            fontFamily: 'Fira Sans',
            fontSize: '8px',
            fontWeight: 'bold',
            fill: Colors.TextColor,
            stroke: Colors.TextOutlineColor,
            strokeThickness: 2
        };
        this.startDisplay = new PIXI.Text('Start', this.textStyle);
        this.startDisplay.x = gameWidth / 2;
        this.startDisplay.y = gameHeight / 2;
    }

    public update(deltaTime: number, context: IGame.IGameContext): void {
        if (context.inputs.keys[Keys.ENTER]) {
            context.game.gotoState(new PlayState());
        }
    }

    get displayObjects(): PIXI.DisplayObject[] {
        return [this.startDisplay];
    }
}
