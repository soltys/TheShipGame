import * as IGame from 'IGame';
export default class Timer implements IGame.ITimer {
    private _tick: number;
    private _nextFireTime: number;
    private _delay: number;
    private _action: () => void;
    get tick() {
        return this._tick;
    }

    get nextFireTime() {
        return this._delay;
    }

    get action() {
        return this._action;
    }

    public triggerAction(currentTime: number) {
        this._nextFireTime = currentTime + this._delay;
        this._action();
    }

    public static create(tick: number, action: () => void): Timer {
        const timer = new Timer();
        timer._tick = tick;
        timer._delay = 0;
        timer._nextFireTime = performance.now() +  timer._delay;
        timer._action = action;
        return timer;
    }
}