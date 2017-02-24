import * as IGame from 'IGame';
export default class Timer implements IGame.ITimer {
    private _nextFireTime: number;
    private _delay: number;
    private _action: () => void;
   
    get nextFireTime() {
        return this._nextFireTime;
    }

    public triggerAction(currentTime: number) {
        this._nextFireTime = currentTime + this._delay;
        this._action();
    }

    public static create(tick: number, action: () => void): Timer {
        const timer = new Timer();
        timer._delay = tick;
        timer._nextFireTime = timer._delay;
        timer._action = action;
        return timer;
    }
}