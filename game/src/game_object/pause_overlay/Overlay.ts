import * as IGame from '@IGame';
import { Keys } from '@core/Keys';
import MouseButtons from '../../core/MouseButtons';
export function DiscardPauseOverlay(context: IGame.IGameContext): boolean {

    const inputs = context.inputs;
    if (inputs.gamepad.isConnected) {
        const buttons = inputs.gamepad.buttons;

        const buttonsIndexes = [0, 1, 2, 3, 8, 9];

        for (const buttonIndex of buttonsIndexes) {
            if (buttons[buttonIndex].pressed) {
                return true;
            }
        }
    }

    const keys = [Keys.UP_ARROW, Keys.DOWN_ARROW, Keys.LEFT_ARROW, Keys.RIGHT_ARROW, Keys.KEY_W, Keys.KEY_S, Keys.SPACE, Keys.ENTER];
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
