import * as IGame from './../IGame';
import { Keys } from 'game-support';
import MouseButtons from './../MouseButtons';
export default function StartGame(context: IGame.IGameContext): boolean {
    const inputs = context.inputs;
    if (inputs.gamepad.isConnected) {
        const buttons = inputs.gamepad.buttons;
        const buttonsIndexes = [8, 9];
        for (const buttonIndex of buttonsIndexes) {
            if (buttons[buttonIndex].pressed) {
                return true;
            }
        }
    }

    const keys = [Keys.SPACE, Keys.ENTER];
    for (const key of keys) {
        if (inputs.keys[key]) {
            return true;
        }
    }

    if (context.game.config.get('isMouseEnabled') && inputs.clicks[MouseButtons.LEFT_BUTTON]) {
        return true;
    }

    return false;
}
