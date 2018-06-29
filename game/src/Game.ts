import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import Colors from './Colors';
import { GetDisplayLayers } from '@core/DisplayLayer';
import { ToGamepadArray } from '@core/GamepadExtensions';
import * as IGame from '@IGame';
import Stats from './Stats';
import TimerService from './TimerService';
import GameConfig from './GameConfig';
import PauseOverlay from './PauseOverlay';
import InitState from './state/InitState';
//import GameLoop from './GameLoop';

export default class Game implements IGame.IHost {
    readonly stage: PIXI.Container;
    readonly displayLayers: PIXI.Container[];
    private readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private readonly context: IGame.IGameContext;
    private gamepads: GamepadList;
    public width = 0;
    public height = 0;
    public readonly config: GameConfig;
    private scale = 1;
    private stats: Stats;
    private requestAnimationFrameId: number | undefined;
    private isAnimationOn: boolean;
    private timerService: TimerService;
    //private gameloop: GameLoop;
    constructor(gameWidth: number, gameHeight: number) {
        this.width = gameWidth;
        this.height = gameHeight;

        this.stage = this.newStage();
        this.displayLayers = [];

        GetDisplayLayers().forEach(_ => {
            const newStage = this.newStage();
            this.displayLayers.push(newStage);
            this.stage.addChild(newStage);
        });

        this.renderer = this.newRenderer();
        this.gamepads = [];

        this.timerService = new TimerService();

        this.context = this.createGameContext();

        this.config = new GameConfig();

        this.stats = new Stats(this.config.get('showFPSCounter'));
        this.isAnimationOn = true;

        //this.gameloop = new GameLoop();
    }

    private createGameContext(): IGame.IGameContext {
        return {
            inputs: {
                keys: {},
                clicks: {},
                mouse: { x: 0, y: 0 },
                touches: [],
                gamepad: {
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
            objects: {
                all: [],
                score: undefined,
                ship: undefined,
                borders: [],
                pauseOverlay: undefined
            },
            state: new InitState(),
            game: this,
            timerService: this.timerService,
            frameDeltaResolver: () => { return 1; }
        };
    }

    isGameDisplayObject(gameObject: IGame.IGameObject | IGame.IGameDisplayObject): gameObject is IGame.IGameDisplayObject {
        return (<IGame.IGameDisplayObject>gameObject).displayObjects !== undefined;
    }

    public removeObject(gameObject: IGame.IGameObject | IGame.IGameDisplayObject): void {
        if (this.isGameDisplayObject(gameObject)) {
            for (const displayObject of gameObject.displayObjects) {
                this.displayLayers[gameObject.displayLayer].removeChild(displayObject);
            }
        }
        const index = _.indexOf(this.context.objects.all, gameObject);
        this.context.objects.all.splice(index, 1);
    }

    public addObject(gameObject: IGame.IGameObject | IGame.IGameDisplayObject): void {
        gameObject.init(this.context);
        this.context.objects.all.push(gameObject);

        if (this.isGameDisplayObject(gameObject)) {
            for (const displayObject of gameObject.displayObjects) {
                this.displayLayers[gameObject.displayLayer].addChild(displayObject);
            }
        }
    }

    private newStage() {
        const stage = new PIXI.Container();
        stage.interactive = true;
        return stage;
    }

    private newRenderer() {
        return PIXI.autoDetectRenderer(this.width, this.height,
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
        this.isAnimationOn = false;
        if (this.requestAnimationFrameId !== undefined) {
            cancelAnimationFrame(this.requestAnimationFrameId);
        }
        if (!this.context.objects.pauseOverlay) {
            this.addObject(new PauseOverlay(this.width, this.height, 'Pause'));
        }

    }

    public animate(forceStart?: boolean) {
        //Set the frame rate
        const fps = 60;

        //Get the start time
        let start = performance.now();
        //Set the frame duration in milliseconds

        if (forceStart) {
            this.isAnimationOn = true;
            return;
        }
        let lagOffset = 1;
        this.context.frameDeltaResolver = () => {
            return lagOffset;
        };

        const caller = (nowTime: number) => {
            this.requestAnimationFrameId = requestAnimationFrame(caller);
            this.stats.measureFrame(() => {
                const elapsed = (nowTime - start).limit(0, 1000);
                start = nowTime;
                lagOffset = elapsed * fps / 1000;

                const gamepads = navigator.getGamepads();
                if (gamepads === null) {
                    this.gamepads = [];
                } else {
                    this.gamepads = <Gamepad[]>gamepads.filter(x => x !== null);
                }

                if (this.gamepads.length > 0) {
                    this.updateGamepadInputs();
                }

                if (this.isAnimationOn) {
                    this.timerService.update(nowTime);
                    this.context.objects.all.forEach((object) => {
                        object.update(lagOffset, this.context);
                    });
                } else {
                    this.context.objects.pauseOverlay.update(lagOffset, this.context);
                }

                this.renderer.render(this.stage);
            });
        };

        caller(start);
    }

    private updateGamepadInputs(): void {
        const inputs = this.context.inputs;

        inputs.gamepad.isConnected = false;

        ToGamepadArray(this.gamepads)
            .filter(x => x)
            .forEach(gamepad => {
                inputs.gamepad.isConnected = true;
                inputs.gamepad.axes = gamepad.axes;
                inputs.gamepad.buttons = gamepad.buttons;
            });
    }

    public addEventListenerToElement(element: HTMLElement): void {
        const inputs = this.context.inputs;
        element.addEventListener('keydown', (event: KeyboardEvent) => {
            inputs.keys[event.keyCode] = true;
        });

        element.addEventListener('keyup', (event: KeyboardEvent) => {
            inputs.keys[event.keyCode] = false;
        });

        element.addEventListener('mousedown', (event: MouseEvent) => {
            if (!this.config.get('isMouseEnabled')) {
                return;
            }
            inputs.clicks[event.which] = {
                x: event.clientX,
                y: event.clientY
            };
        });

        element.addEventListener('mouseup', (event: MouseEvent) => {
            if (!this.config.get('isMouseEnabled')) {
                return;
            }
            delete inputs.clicks[event.which];
        });

        element.addEventListener('mousemove', (event: MouseEvent) => {
            if (!this.config.get('isMouseEnabled')) {
                return;
            }
            inputs.mouse.x = (event.clientX - this.renderer.view.getBoundingClientRect().left) / this.scale;
            inputs.mouse.y = (event.clientY - this.renderer.view.getBoundingClientRect().top) / this.scale;
        });

        element.addEventListener('wheel', (event: WheelEvent) => {
            event.preventDefault();
            if (!this.config.get('isMouseEnabled')) {
                return;
            }
            inputs.wheel = {
                deltaX: event.deltaX,
                deltaY: event.deltaY,
                deltaZ: event.deltaZ
            };
        }, { passive: true });
    }
}
