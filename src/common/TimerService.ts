import * as IGame from 'IGame';
export default class TimerService {
    private _timerList: IGame.ITimer[];

    /**
     *
     */
    constructor() {
        this._timerList = [];        
    }

    public add(timer: IGame.ITimer) {
        this._timerList.push(timer);
    }

    public update(currentTime: number) {
        for(const timer of this._timerList){
            if(currentTime > timer.nextFireTime){
                timer.triggerAction(currentTime);                
            }
        }
    }
}