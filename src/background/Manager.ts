import * as IGame from '../common/IGame';
import GameObject from '../common/GameObject';
import * as PIXI from 'pixi.js';

/**
 * Game Size
 * const gameWidth = 640;  == 20 tiles 32x32 pixels each
 * const gameHeight = 704; == 22 tiles 32x32 pixels each
 * 2 rows of tiles and 2 columns of tiles are used by game border
 * 
 */
export default class Manager extends GameObject implements IGame.IGameDisplayObject {
    /**
     *
     */
    private graphics: PIXI.Graphics;
    private offsetVertical: number;
    private offsetHorizontal: number;
    constructor() {
        super();
    }

    collideWith(boundingBox: IGame.IBoundingBox): IGame.ICollisionData {
        return super.collideWith(boundingBox);
    }

    get displayObjects() {
        return [this.graphics];
    }

    init(state: IGame.IGameContext): void {
        this.graphics = new PIXI.Graphics();
        this.offsetVertical = 0;
        this.offsetHorizontal = 0;
    }

    update(delta: number, state: IGame.IGameContext): void {
        const g = this.graphics;

        g.clear();
        g.beginFill(0xff0000);
        for (let line = 32; line < state.game.width; line += 64) {
            g.drawRect(line + this.offsetHorizontal, 0, 1, state.game.height);
        }

        for (let line = this.offsetVertical; line < state.game.height; line += 64) {
            g.drawRect(0, line + this.offsetVertical, state.game.width, 1);
        }
        g.endFill();

        //this.offsetHorizontal = ((state.game.width / 2) - (state.objects.ship.position.x + 32)) /5;        
        this.offsetVertical = (this.offsetVertical + 1 * delta) % 32;
    }
}
