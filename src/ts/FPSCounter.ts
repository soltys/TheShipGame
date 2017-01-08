import GameObject from './common/GameObject';
import Colors from './common/Colors';
export default class FPSCounter extends GameObject implements IGame.IGameDisplayObject {
    private lastCalledTime: number;
    private counter: number;

    private fpsArray: Array<number>;

    private fpsDisplay: PIXI.Text;
    private textStyle: Object;

    constructor() {
        super();
        this.counter = 0;
        this.fpsArray = [];

        this.textStyle = {
            fontFamily: 'Fira Sans',
            fontSize: '8px',
            fontWeight: 'bold',
            fill: Colors.TextColor,
            stroke: Colors.TextOutlineColor,
            strokeThickness: 2
        };
        this.fpsDisplay = new PIXI.Text('0 FPS', this.textStyle);
        this.fpsDisplay.x = 10;
        this.fpsDisplay.y = 10;
    }

    public update() {
        let fps;

        if (!this.lastCalledTime) {
            this.lastCalledTime = new Date().getTime();
            fps = 0;
        }

        const delta = (new Date().getTime() - this.lastCalledTime) / 1000;
        this.lastCalledTime = new Date().getTime();
        fps = Math.ceil((1 / delta));

        if (this.counter >= 60) {
            const sum = this.fpsArray.reduce((a, b) => { return a + b; });
            const average = Math.ceil(sum / this.fpsArray.length);
            this.updateFPSDisplay(average);
            this.counter = 0;
            this.fpsArray = [];
        } else {
            if (fps !== Infinity) {
                this.fpsArray.push(fps);
            }
            this.counter++;
        }
    }

    get displayObjects(): PIXI.DisplayObject[] {
        return [this.fpsDisplay];
    }

    private updateFPSDisplay(fps: number) {
        this.fpsDisplay.text = `${fps} FPS`;
    }
}




