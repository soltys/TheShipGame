import * as IGame from 'IGame';
export default class TimerService {
    private _timerList: IGame.ITimer[];

    public add(timer: IGame.ITimer) {
        this._timerList.push(timer);
    }

    public update(curremtTime: number) {
        for(const timer of this._timerList){
            if(curremtTime > timer.nextFireTime){
                timer.triggerAction(curremtTime);
            }
        }
    }
}