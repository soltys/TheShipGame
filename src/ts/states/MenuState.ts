import BaseState from './BaseState';
import Menu from './../Menu';

export default class MenuState extends BaseState {

    constructor() {
        super();

    }
    private menu: Menu;
    handle(context: IGame.IGameContext) {
        const game = context.game;
        this.menu = new Menu(game.gameWidth, game.gameHeight);
        game.addObject(this.menu);
    }

    onLeave(context: IGame.IGameContext) {
        context.game.removeObject(this.menu);
    }
}



