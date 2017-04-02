import * as IGame from './../common/IGame';
import BaseState from './BaseState';
import MenuGameObject from './../Menu';

export default class Menu extends BaseState {

    constructor() {
        super();

    }
    private menu: MenuGameObject;
    handle(context: IGame.IGameContext) {
        const game = context.game;
        this.menu = new MenuGameObject(game.width, game.height);
        game.addObject(this.menu);
    }

    onLeave(context: IGame.IGameContext) {
        context.game.removeObject(this.menu);
    }
}
