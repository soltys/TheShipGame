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
    
    constructor() {
        super();        
    }
    collideWith(boundingBox: IGame.IBoundingBox): IGame.ICollisionData {
        return super.collideWith(boundingBox);
    }

    displayObjects: PIXI.DisplayObject[];
    
    init(state: IGame.IGameContext): void {
    }
    update(delta: number, state: IGame.IGameContext): void {
    }
    


}