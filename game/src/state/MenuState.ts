import * as IGame from '@IGame';
import MenuGameObject from './../Menu';
import BaseState from './BaseState';

export default class Menu extends BaseState {

    private menu: MenuGameObject | undefined;
    handle(context: IGame.IGameContext) {
        const game = context.game;
        this.menu = new MenuGameObject(game.width, game.height);
        game.addObject(this.menu);
    }

    onLeave(context: IGame.IGameContext) {
        if (this.menu !== undefined) {
            context.game.removeObject(this.menu);
        }
    }
}
