import GameObject from './common/GameObject';
import * as IGame from './common/IGame';
export default class FPSCounter extends GameObject implements IGame.IGameDisplayObject {
    private lastCalledTime: number
    private counter: number

    private fpsArray: Array<number>

    private fpsDisplay: PIXI.Text
    private textStyle:Object;

    constructor() {
        super();
        this.counter = 0;
        this.fpsArray = [];

        this.textStyle = {
            fontFamily: 'Consolas',
            fontSize: '16px',
            fontWeight: 'bold',
            fill: IGame.Colors.TextColor,
            stroke: IGame.Colors.TextOutlineColor,
            strokeThickness: 5
        };
        this.fpsDisplay = new PIXI.Text('0 FPS', this.textStyle);
        this.fpsDisplay.x = 10;
        this.fpsDisplay.y = 10;
    }

    public update() {
        var fps;

        if (!this.lastCalledTime) {
            this.lastCalledTime = new Date().getTime();
            fps = 0;
        }

        var delta = (new Date().getTime() - this.lastCalledTime) / 1000;
        this.lastCalledTime = new Date().getTime();
        fps = Math.ceil((1 / delta));

        if (this.counter >= 10) {
            var sum = this.fpsArray.reduce(function (a, b) { return a + b });
            var average = Math.ceil(sum / this.fpsArray.length);
            this.updateFPSDisplay(average);
            this.counter = 0;
            this.fpsArray=[];
        } else {
            if (fps !== Infinity) {
                this.fpsArray.push(fps);
            }
            this.counter++;
        }
    }

    get displayObject(): PIXI.DisplayObject {
        return this.fpsDisplay;
    }

    private updateFPSDisplay(fps: number) {
        this.fpsDisplay.text = `${fps} FPS`;
    }
}




