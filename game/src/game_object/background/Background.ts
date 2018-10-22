import * as PIXI from 'pixi.js';
import GameObject from '@core/GameObject';
import * as IGame from '@IGame';
import { DisplayLayer } from '@core/DisplayLayer';
import * as Utils from '@core/Utils';

/**
 * Game Size
 * const gameWidth = 640;  == 20 tiles 32x32 pixels each
 * const gameHeight = 704; == 22 tiles 32x32 pixels each
 * 2 rows of tiles and 2 columns of tiles are used by game border
 *
 */
export default class Background extends GameObject implements IGame.IGameDisplayObject {
    private graphics: PIXI.Graphics;
    private offsetVertical: number;

    private lines: { color: number, currentOffset: number }[];
    constructor() {
        super();
        this.lines = [];
        this.graphics = new PIXI.Graphics();
        this.offsetVertical = 0;
    }

    collideWith(boundingBox: IGame.IBoundingBox): IGame.ICollisionData {
        return super.collideWith(boundingBox);
    }

    get displayObjects() {
        return [this.graphics];
    }

    get displayLayer(): DisplayLayer {
        return DisplayLayer.Background;
    }

    init(state: IGame.IGameContext): void {
        for (let line = this.offsetVertical; line < state.game.height; line += 64) {
            this.lines.push({
                color: this.getRandomColor(),
                currentOffset: line
            });

        }
    }

    update(delta: number, state: IGame.IGameContext): void {
        const g = this.graphics;

        g.clear();

        for (const line of this.lines) {
            g.beginFill(line.color);
            g.drawRect(0, line.currentOffset, state.game.width, 65);
            g.endFill();
            line.currentOffset += 1 * delta;
        }

        const linesNotOnScreen = this.lines.filter(x => x.currentOffset < 0).length;
        if (linesNotOnScreen === 0) {
            this.lines.push({
                color: this.getRandomColor(),
                currentOffset: -64
            });
        }
        this.lines = this.lines.filter(line => line.currentOffset < state.game.height);
    }

    getRandomColor(): number {
        const max = 255;
        const brightness = 45;
        const red = Math.min((brightness + Utils.random(0, 10)), max) * 0x010000;
        const green = Math.min((brightness + Utils.random(10, 30)), max) * 0x000100;
        const blue = Math.min((brightness + Utils.random(0, 10)), max) * 0x000001;

        return red + green + blue;
    }
}
