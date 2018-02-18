import * as IGame from './../common/IGame';
import MenuGameObject from './../Menu';
import BaseState from './BaseState';

export default class Menu extends BaseState {

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
