import Colors from './Colors';
import { DisplayLayer } from 'game-core';
import GameObject from './GameObject';
import * as IGame from './IGame';
import { DiscardPauseOverlay } from './input/Overlay';

export default class PauseOverlay extends GameObject implements IGame.IGameDisplayObject {
    private overlayMessage: PIXI.Text;
    private graphics: PIXI.Graphics;
    private textStyle: Object;

    get displayLayer(): DisplayLayer {
        return DisplayLayer.Overlay;
    }

    constructor(gameWidth: number, gameHeight: number, message: string) {
        super();

        this.textStyle = {
            fontFamily: 'Fira Sans',
            fontSize: '72px',
            fontWeight: 'bold',
            fill: Colors.TextColor,
            stroke: Colors.TextOutlineColor,
            strokeThickness: 2
        };
        this.overlayMessage = new PIXI.Text(message, this.textStyle);
        this.overlayMessage.y = gameHeight / 2 - this.overlayMessage.width / 2;
        this.overlayMessage.x = gameWidth / 2 - this.overlayMessage.width / 2;

        this.graphics = new PIXI.Graphics();
    }

    init(state: IGame.IGameContext): void {
        state.objects.pauseOverlay = this;
    }

    update(delta: number, state: IGame.IGameContext): void {
        this.graphics.clear();
        this.graphics.beginFill(Colors.OverlayColor, 0.25);
        this.graphics.drawRect(0, 0, state.game.width, state.game.height);
        this.graphics.endFill();
        if (DiscardPauseOverlay(state)) {
            state.game.removeObject(this);
            state.objects.pauseOverlay = undefined;
            state.game.animate(true);
        }

    }

    get displayObjects(): PIXI.DisplayObject[] {
        return [this.overlayMessage, this.graphics];
    }
}
