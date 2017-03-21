import * as IGame from './common/IGame';
export default class GameConfig {

    private config: IGame.IConfig;

    /**
     *
     */
    constructor() {
        this.config = this.getInitConfig();
    }
    /**
     * GetInitConfig
     */
    getInitConfig(): IGame.IConfig {
        return {
            isMouseEnabled: false,
            showFPSCounter: true
        };
    }

    update(configKey, newValue) {
        const oldValue = this.config[configKey];
        this.config[configKey] = newValue;
        const configUpdated = new CustomEvent('configUpdated', {
            detail: {
                key: configKey,
                newValue: newValue,
                oldValue: oldValue
            }
        });
        document.dispatchEvent(configUpdated);
        
    }

    public get(configKey) {
        return this.config[configKey]; 
    }
}
