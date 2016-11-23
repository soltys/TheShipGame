import * as IGame from './common/IGame';
import * as _ from 'lodash';
class Game {
    public readonly stage: PIXI.Container;
    private readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private readonly context: IGame.IGameContext;
    private gamepads: Gamepad[];
    private gameWidth = 0;
    private gameHeight = 0;
    constructor(gameWidth: number, gameHeight: number) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.stage = this.newStage();
        this.stage.interactive = true;
        this.renderer = this.newRenderer();
        this.gamepads = [];

        this.context = {
            inputs: {
                "keys": {},
                "clicks": {},
                "mouse": { clientX: 0, clientY: 0 },
                "gamepad": {
                    buttons: [],
                    axes: [],
                    isConnected: false
                }
            },
            "objects": {
                "all": []
            },
            "game": this,
            "score": null
        };

    }

    public removeObject(gameObject: IGame.IGameObject): void {
        const displayObjects = (<IGame.IGameDisplayObject>gameObject).displayObjects;
        if (displayObjects) {
            for (const displayObject of displayObjects) {
                this.stage.removeChild(displayObject);
            }

        }

        const index = _.indexOf(this.context.objects.all, gameObject);
        this.context.objects.all.splice(index, 1);
    }

    public addObject(gameObject: IGame.IGameObject): void {
        gameObject.init(this.context);

        this.context.objects.all.push(gameObject);
        const displayObjects = (<IGame.IGameDisplayObject>gameObject).displayObjects;
        if (displayObjects) {
            for (const displayObject of displayObjects) {
                this.stage.addChild(displayObject);
            }

        }
    }

    private newStage() {
        return new PIXI.Container();
    }

    private newRenderer() {
        return PIXI.autoDetectRenderer(this.gameWidth, this.gameHeight,
            {
                backgroundColor: IGame.Colors.Background,
                antialias: true,
                roundPixels: false,
                resolution: 2,
            });
    }

    public addRendererToElement(element: HTMLElement): void {
        element.appendChild(this.renderer.view);
    }

    public animate() {
        //Set the frame rate
        const fps = 60;
        //Get the start time
        let start = Date.now();
        //Set the frame duration in milliseconds
        const frameDuration = 1000 / fps;


        const caller = () => {
            requestAnimationFrame(caller);

            const current = Date.now(),
                elapsed = current - start;
            start = current;
            //Add the elapsed time to the lag counter

            let lagOffset = elapsed / frameDuration;
            this.gamepads = navigator.getGamepads() || [];

            const inputs = this.context.inputs;
            inputs.gamepad.isConnected = false;
            for (const gamepad of this.gamepads) {
                if (gamepad) {
                    inputs.gamepad.isConnected = true;
                    inputs.gamepad.axes = gamepad.axes;
                    inputs.gamepad.buttons = gamepad.buttons;
                }
            }

            this.context.objects.all.forEach((object) => {
                object.update(lagOffset, this.context);
            });

            this.renderer.render(this.stage);

        };

        requestAnimationFrame(caller);

    }

    public addEventListenerToElement(element): void {
        const inputs = this.context.inputs;
        element.addEventListener("keydown", (event) => {
            inputs.keys[event.keyCode] = true;
        });

        element.addEventListener("keyup", (event) => {
            inputs.keys[event.keyCode] = false;
        });

        element.addEventListener("mousedown", (event) => {
            inputs.clicks[event.which] = {
                "clientX": event.clientX,
                "clientY": event.clientY
            };
        });

        element.addEventListener("mouseup", (event) => {
            inputs.clicks[event.which] = false;
        });

        element.addEventListener("mousemove", (event) => {
            inputs.mouse.clientX = event.clientX;
            inputs.mouse.clientY = event.clientY;
        });

    }
}

export default Game;