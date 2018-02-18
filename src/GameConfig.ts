import * as _ from 'lodash';
import * as IGame from './IGame';
import IStorage from './IStorage';
import LocalStorageFascade from './LocalStorageFacade';
export default class GameConfig {

    private config: IGame.IConfig;
    private localStorage: IStorage;

    constructor() {

        this.localStorage = new LocalStorageFascade();

        const factoryDefault = this.getFactoryDefaultConfig();
        const localStorageConfig = this.localStorage.get('gameconfig');
        this.config = _.assign(factoryDefault, localStorageConfig);
    }

    getFactoryDefaultConfig(): IGame.IConfig {
        return {
            isMouseEnabled: false,
            showFPSCounter: true
        };
    }

    update(configKey: string, newValue) {
        const oldValue = this.config[configKey];
        this.config[configKey] = newValue;
        this.localStorage.set('gameconfig', this.config);
        const configUpdated = new CustomEvent('configUpdated', {
            detail: {
                key: configKey,
                newValue: newValue,
                oldValue: oldValue
            }
        });
        document.dispatchEvent(configUpdated);

    }

    public get(configKey: string): {} {
        return this.config[configKey];
    }

    public getAll(): Readonly<IGame.IConfig> {
        return this.config;
    }
}
