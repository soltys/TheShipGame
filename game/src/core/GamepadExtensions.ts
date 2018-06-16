export function ToGamepadArray(gamepadList: GamepadList) {
    const gamepads: Gamepad[] = [];
    for (let i = 0; i < gamepadList.length; i += 1) {
        gamepads.push(gamepadList[i]);
    }
    return gamepads;
}
