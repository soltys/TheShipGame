import * as IGame from './common/IGame';
import * as _ from 'lodash';
class Game {
    public readonly stage: PIXI.Container;
    private readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private readonly state: IGame.IGameContext;
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

        this.state = {
            "keys": {},
            "clicks": {},
            "mouse": { clientX: 0, clientY: 0 },
            "gamepad": {
                buttons: [],
                axes: [],
                isConnected: false
            },
            "objects": [],
            "game": this,
            "score": null
        };

    }

    public removeObject(gameObject: IGame.IGameObject): void {
        const displayObjects = (<IGame.IGameDisplayObject>gameObject).displayObjects;
        if (displayObjects) {
            for (const displayObject of displayObjects){
                this.stage.removeChild(displayObject);
            }
                
        }

        var index = _.indexOf(this.state.objects, gameObject);
        this.state.objects.splice(index, 1);


    }

    public addObject(gameObject: IGame.IGameObject): void {
        gameObject.init(this.state);

        this.state.objects.push(gameObject);
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
        

        var caller = () => {
            requestAnimationFrame(caller);

            var current = Date.now(),
                elapsed = current - start;
            start = current;
            //Add the elapsed time to the lag counter

            let lagOffset = elapsed / frameDuration;
            this.gamepads = navigator.getGamepads() || [];

            this.state.gamepad.isConnected = false;
            for (let i = 0; i < this.gamepads.length; i++) {
                const gamepad = this.gamepads[i];
                if (gamepad) {
                    this.state.gamepad.isConnected = true;
                    this.state.gamepad.axes = gamepad.axes;
                    this.state.gamepad.buttons = gamepad.buttons;
                }
            }

            this.state.objects.forEach((object) => {
                object.update(lagOffset, this.state);
            });

            this.renderer.render(this.stage);

        };

        requestAnimationFrame(caller);

    }

    public addEventListenerToElement(element): void {
        element.addEventListener("keydown", (event) => {
            this.state.keys[event.keyCode] = true;
        });

        element.addEventListener("keyup", (event) => {
            this.state.keys[event.keyCode] = false;
        });

        element.addEventListener("mousedown", (event) => {
            this.state.clicks[event.which] = {
                "clientX": event.clientX,
                "clientY": event.clientY
            };
        });

        element.addEventListener("mouseup", (event) => {
            this.state.clicks[event.which] = false;
        });

        element.addEventListener("mousemove", (event) => {
            this.state.mouse.clientX = event.clientX;
            this.state.mouse.clientY = event.clientY;
        });

    }
}

export default Game;