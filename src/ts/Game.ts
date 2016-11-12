import * as IGame from './common/IGame';
class Game {
    private readonly stage: PIXI.Container;
    private readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private readonly state: IGame.IGameState;
    private gamepads: Gamepad[];
    private gameWidth=0;
    private gameHeight=0;
    constructor(gameWidth:number, gameHeight:number) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        this.stage = this.newStage()
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
            debugSTAGE: this.stage

        };
    }


    public addObject(object: IGame.IGameObject): void {
        this.state.objects.push(object);

        if ((<IGame.IGameDisplayObject>object).displayObject) {
            this.stage.addChild((<IGame.IGameDisplayObject>object).displayObject);
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
                roundPixels:false,
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
        //Initialize the lag offset
        let lag = 0;

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

        return this;
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