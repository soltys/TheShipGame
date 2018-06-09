import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import Colors from './Colors';
import { GetNumberOfDisplayLayers } from '@core/DisplayLayer';
import * as IGame from '@IGame';
import Stats from './Stats';
import TimerService from './TimerService';
import GameConfig from './GameConfig';
import PauseOverlay from './PauseOverlay';
import InitState from './state/InitState';
export default class Game implements IGame.IHost {
    readonly stage: PIXI.Container;
    readonly displayLayers: PIXI.Container[];
    private readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private readonly context: IGame.IGameContext;
    private gamepads: Gamepad[];
    public width = 0;
    public height = 0;
    public readonly config: GameConfig;
    private scale = 1;
    private stats: Stats;
    private requestAnimationFrameId: number;
    private isAnimationOn: boolean;
    private timerService: TimerService;
    constructor(gameWidth: number, gameHeight: number) {
        this.width = gameWidth;
        this.height = gameHeight;

        this.stage = this.newStage();
        this.displayLayers = [];
        for (let stageIndex = 0; stageIndex <= GetNumberOfDisplayLayers(); stageIndex += 1) {
            const newStage = this.newStage();
            this.displayLayers.push(newStage);
            this.stage.addChild(newStage);
        }

        this.renderer = this.newRenderer();
        this.gamepads = [];

        this.timerService = new TimerService();

        this.context = this.createGameContext();

        this.config = new GameConfig();

        this.stats = new Stats(this.config.get('showFPSCounter'));
        this.isAnimationOn = true;
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
            timerService: this.timerService
        };
    }

    public removeObject(gameObject: IGame.IGameObject): void {
        const gameDisplayObject = (<IGame.IGameDisplayObject>gameObject);
        if (gameDisplayObject) {
            for (const displayObject of gameDisplayObject.displayObjects) {
                this.displayLayers[gameDisplayObject.displayLayer].removeChild(displayObject);
            }
        }

        const index = _.indexOf(this.context.objects.all, gameObject);
        this.context.objects.all.splice(index, 1);
    }

    public addObject(gameObject: IGame.IGameObject): void {
        gameObject.init(this.context);
        this.context.objects.all.push(gameObject);
        const gameDisplayObject = (<IGame.IGameDisplayObject>gameObject);
        if (gameDisplayObject) {
            for (const displayObject of gameDisplayObject.displayObjects) {
                this.displayLayers[gameDisplayObject.displayLayer].addChild(displayObject);
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
        cancelAnimationFrame(this.requestAnimationFrameId);
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

        const caller = (nowTime: number) => {
            this.requestAnimationFrameId = requestAnimationFrame(caller);

            this.stats.begin();
            let elapsed = nowTime - start;
            start = nowTime;

            //Add the elapsed time to the lag counter
            if (elapsed < 0) {
                elapsed = 0;
            }
            if (elapsed > 1000) {
                elapsed = 1000;
            }
            const lagOffset = elapsed * fps / 1000;

            this.gamepads = navigator.getGamepads() || [];
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
            this.stats.end();
        };

        caller(start);
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
        const touchStart = (event: TouchEvent) => {
            event.preventDefault();
            const touches = event.changedTouches;
            const inputs = this.context.inputs;
            for (let i = 0; i < touches.length; i += 1) {
                const touch = touches[i];
                inputs.touches.push({
                    id: touch.identifier,
                    x: touch.pageX,
                    y: touch.pageY
                });
            }
        };

        const touchMove = (event: TouchEvent) => {
            event.preventDefault();
            const touches = event.changedTouches;
            const inputs = this.context.inputs;

            for (let i = 0; i < touches.length; i += 1) {
                const touch = touches[i];
                const touchPoint = _.find(inputs.touches, (t) => t.id === touch.identifier);
                if (touchPoint) {
                    touchPoint.x = touch.pageX;
                    touchPoint.y = touch.pageY;
                }
            }
        };

        const touchEnd = (event: TouchEvent) => {
            event.preventDefault();
            const touches = event.changedTouches;
            const inputs = this.context.inputs;

            for (let i = 0; i < touches.length; i += 1) {
                const touch = touches[i];
                _.remove(inputs.touches, (t) => t.id === touch.identifier);
            }
        };
        element.addEventListener('touchstart', touchStart, false);
        element.addEventListener('touchend', touchEnd, false);
        element.addEventListener('touchcancel', touchEnd, false);
        element.addEventListener('touchmove', touchMove, false);
    }
}
