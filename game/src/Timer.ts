import * as IGame from '@IGame';
export default class Timer implements IGame.ITimer {
    private _nextFireTime: number;
    private delay: number;
    private action: () => void;

    get nextFireTime() {
        return this._nextFireTime;
    }

    public triggerAction(currentTime: number) {
        this._nextFireTime = currentTime + this.delay;
        this.action();
    }

    public static create(tick: number, action: () => void): Timer {
        const timer = new Timer();
        timer.delay = tick;
        timer._nextFireTime = timer.delay;
        timer.action = action;
        return timer;
    }
}
