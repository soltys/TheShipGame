import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import Colors from './common/Colors';
import * as IGame from './common/IGame';
import Stats from './common/Stats';
import TimerService from './common/TimerService';
import InitState from './states/InitState';
class Game implements IGame.IHost {
    public readonly stage: PIXI.Container;
    private readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private readonly context: IGame.IGameContext;
    private gamepads: Gamepad[];
    public gameWidth = 0;
    public gameHeight = 0;
    public readonly config: IGame.IConfig;
    private scale = 1;
    private stats: Stats;
    private requestAnimationFrameId: number;

    private timerService: TimerService;
    constructor(gameWidth: number, gameHeight: number) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.stage = this.newStage();
        this.stage.interactive = true;
        this.renderer = this.newRenderer();
        this.gamepads = [];

        this.timerService = new TimerService();

        this.context = this.createGameContext();

        this.stats = new Stats();

        this.config = {
            isMouseEnabled: false,
            showFPSCounter:true
        };

        
    }

    private createGameContext(): IGame.IGameContext {
        return {
            inputs: {
                "keys": {},
                "clicks": {},
                "mouse": { clientX: 0, clientY: 0 },
                "gamepad": {
                    buttons: [],
                    axes: [],
                    isConnected: false
                },
                wheel: {
                    deltaX: 0,
                    deltaY: 0,
                    deltaZ: 0
                }
            },
            "objects": {
                "all": [],
                "score": undefined,
                "ship": undefined
            },
            "state": new InitState(),
            "game": this,
            "timerService": this.timerService
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
                backgroundColor: Colors.Background,
                antialias: true,
                roundPixels: false,
                resolution: this.scale
            });
    }

    public addRendererToElement(element: HTMLElement): void {
        element.appendChild(this.renderer.view);
    }

    public addFPSCounter(element: HTMLElement): void {
        element.appendChild(this.stats.container);
    }

    public gotoState(state: IGame.IGameState) {
        if (this.context.state) {
            this.context.state.onLeave(this.context);
        }
        this.context.state = state;
        this.context.state.handle(this.context);
    }

    public pause() {
        cancelAnimationFrame(this.requestAnimationFrameId);
    }

    public animate() {
        //Set the frame rate
        const fps = 60;
        //Get the start time
        let start = Date.now();
        //Set the frame duration in milliseconds
        const frameDuration = 1000 / fps;


        const caller = (currentTime) => {
            this.requestAnimationFrameId = requestAnimationFrame(caller);

            this.stats.begin();
            const current = performance.now();
            const elapsed = current - start;
            start = current;
            //Add the elapsed time to the lag counter
            const lagOffset = elapsed / frameDuration;


            this.gamepads = navigator.getGamepads() || [];
            if (this.gamepads.length > 0) {
                this.updateGamepadInputs();
            }
            this.timerService.update(currentTime);
            this.context.objects.all.forEach((object) => {
                object.update(lagOffset, this.context);
            });

            this.renderer.render(this.stage);
            this.stats.end();

        };

        caller(0);
    }

    private updateGamepadInputs(): void {
        const inputs = this.context.inputs;

        inputs.gamepad.isConnected = false;
        for (const gamepad of this.gamepads) {
            if (gamepad) {
                inputs.gamepad.isConnected = true;
                inputs.gamepad.axes = gamepad.axes;
                inputs.gamepad.buttons = gamepad.buttons;
            }
        }
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
            if (!this.config.isMouseEnabled) {
                return;
            }
            inputs.clicks[event.which] = {
                "clientX": event.clientX,
                "clientY": event.clientY
            };
        });

        element.addEventListener("mouseup", (event) => {
            if (!this.config.isMouseEnabled) {
                return;
            }
            delete inputs.clicks[event.which];
        });

        element.addEventListener("mousemove", (event) => {
            if (!this.config.isMouseEnabled) {
                return;
            }
            inputs.mouse.clientX = (event.clientX - this.renderer.view.getBoundingClientRect().left) / this.scale;
            inputs.mouse.clientY = (event.clientY - this.renderer.view.getBoundingClientRect().top) / this.scale;
        });

        element.addEventListener("wheel", (event) => {
            event.preventDefault();
            if (!this.config.isMouseEnabled) {
                return;
            }
            inputs.wheel = {
                deltaX: event.deltaX,
                deltaY: event.deltaY,
                deltaZ: event.deltaZ
            };
        }, false);
    }
}

export default Game;