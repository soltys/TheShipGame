import * as IGame from '@IGame';
import GameConfig from './GameConfig';
export interface IPanel {
    dom: HTMLCanvasElement;
    update(value: any, maxValue: any);
}
export default class Stats {
    /**
     *
     */
    private mode: number;
    public container: HTMLDivElement;
    private beginTime: number;
    private prevTime: number;
    private frames: number;
    private fpsPanel: IPanel;
    private msPanel: IPanel;
    private memPanel: IPanel;
    constructor(showAfterCreating: any) {
        this.mode = 0;
        this.container = document.createElement('div');
        this.container.className = 'fps-counter';
        this.container.addEventListener('click', (event) => {
            event.preventDefault();
            this.mode += 1;
            this.showPanel(this.mode % this.container.children.length);
        }, false);

        document.addEventListener(GameConfig.ConfigUpdatedEventName, (event: CustomEvent) => {
            event.preventDefault();
            const eventData = <IGame.IConfigUpdatedEvent>event.detail;
            if (eventData.key === 'showFPSCounter') {
                if (eventData.newValue) {
                    this.mode = 0;
                    this.showPanel(0);
                } else {
                    this.mode = -1;
                    this.showPanel(-1);
                }
            }
        });
        const performance = window.performance;
        this.beginTime = (performance || Date).now();
        this.prevTime = this.beginTime;
        this.frames = 0;
        this.fpsPanel = this.addPanel(this.Panel('FPS', '#0ff', '#002'));
        this.msPanel = this.addPanel(this.Panel('MS', '#0f0', '#020'));
        if (performance && (<any>performance).memory) {
            this.memPanel = this.addPanel(this.Panel('MB', '#f08', '#201'));

        }

        if (showAfterCreating) {
            this.mode = 0;
            this.showPanel(0);
        } else {
            this.mode = -1;
            this.showPanel(-1);
        }
    }

    public addPanel(panel: IPanel): IPanel {
        this.container.appendChild(panel.dom);
        return panel;
    }

    public showPanel(id: number) {
        for (let i = 0; i < this.container.children.length; i += 1) {
            (<any>this.container.children[i]).style.display = i === id ? 'block' : 'none';
        }
        this.mode = id;

    }
    public update() {
        this.beginTime = this.end();
    }


    public end() {
        this.frames += 1;
        const time = (performance || Date).now();
        this.msPanel.update(time - this.beginTime, 200);
        if (time > this.prevTime + 1000) {
            this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);

            this.prevTime = time;
            this.frames = 0;
            if (this.memPanel) {
                const memory = (<any>performance).memory;
                this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
            }
        }
        return time;
    }
    public begin() {
        this.beginTime = (performance || Date).now();
    }

    private Panel(name, fg, bg): IPanel {
        let min = Infinity;
        let max = 0;
        const round = Math.round;
        const PR = round(window.devicePixelRatio || 1);

        const WIDTH = 80 * PR, HEIGHT = 48 * PR,
            TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
            GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
            GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.cssText = 'width:80px;height:48px';

        const context = canvas.getContext('2d');
        context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
        context.textBaseline = 'top';

        context.fillStyle = bg;
        context.fillRect(0, 0, WIDTH, HEIGHT);

        context.fillStyle = fg;
        context.fillText(name, TEXT_X, TEXT_Y);
        context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

        context.fillStyle = bg;
        context.globalAlpha = 0.9;
        context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

        return {
            dom: canvas,
            update: function (value, maxValue) {

                min = Math.min(min, value);
                max = Math.max(max, value);

                context.fillStyle = bg;
                context.globalAlpha = 1;
                context.fillRect(0, 0, WIDTH, GRAPH_Y);
                context.fillStyle = fg;
                context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);

                context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

                context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

                context.fillStyle = bg;
                context.globalAlpha = 0.9;
                context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
            }
        };
    }
}
