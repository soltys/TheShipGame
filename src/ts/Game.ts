class Game {
    private readonly stage: PIXI.Container;
    private readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private readonly state: ThisGame.IGameState;

    constructor() {
        this.stage = this.newStage()
        this.renderer = this.newRenderer();

        this.state = {
            "keys": {},
            "clicks": {},
            "mouse": { clientX: 0, clientY: 0 },
            "objects": []
        };
    }


    public addObject(object: ThisGame.IGameDisplayObject) {
        this.state.objects.push(object);

        if (object.displayObject) {
            this.stage.addChild(object.displayObject);
        }

        return this;
    }

    private newStage() {
        return new PIXI.Container();
    }

    private newRenderer() {
        return PIXI.autoDetectRenderer(800, 600,
            {
                backgroundColor: 0x1099bb,
                "antialias": true,
            });
    }

    public addRendererToElement(element: HTMLElement) {
        element.appendChild(this.renderer.view);
        return this;
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


            this.state.objects.forEach((object) => {
                object.update(lagOffset,this.state);           
            });

            this.renderer.render(this.stage);
        };

        caller();

        return this;
    }

    public addEventListenerToElement(element) {
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

        return this;
    }
}

export default Game;