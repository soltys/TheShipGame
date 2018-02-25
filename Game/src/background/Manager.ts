import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import GameObject from '../GameObject';
import * as IGame from '../IGame';
import { DisplayLayer } from 'game-core';


/**
 * Game Size
 * const gameWidth = 640;  == 20 tiles 32x32 pixels each
 * const gameHeight = 704; == 22 tiles 32x32 pixels each
 * 2 rows of tiles and 2 columns of tiles are used by game border
 *
 */
export default class Manager extends GameObject implements IGame.IGameDisplayObject {
    private graphics: PIXI.Graphics;
    private offsetVertical: number;

    private lines: { color: number, currentOffset: number }[];
    constructor() {
        super();
        this.lines = [];
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
        this.graphics = new PIXI.Graphics();
        this.offsetVertical = 0;

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
        const minLine = _.minBy(this.lines, (line) => { return line.currentOffset; });

        if (minLine.currentOffset >= 0) {
            this.lines.push({
                color: this.getRandomColor(),
                currentOffset: -64
            });
        }
        _.remove(this.lines, (line) => { return line.currentOffset > state.game.height; });
    }

    getRandomColor(): number {
        const brightness = 30;
        const red = (brightness + _.random(13, 50, false)) * 0x010000;
        const green = (brightness + _.random(0, 10, false)) * 0x000100;
        const blue = (brightness + _.random(0, 10, false)) * 0x000001;

        return red + green + blue;
    }
}
