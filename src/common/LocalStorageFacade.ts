import * as _ from 'lodash';
import { IStorage } from './IStorage';
let instance = undefined;
export default class LocalStorageFacade implements IStorage {

    /**
     * Creates instance or gets one which exists already
     */
    constructor() {
        if (!instance) {
            instance = this;
        }

        return instance;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
    clear() {
        localStorage.clear();
    }

    get(key: string): {} {
        const localStorageValue = localStorage.getItem(key);
        if (_.isEmpty(localStorage)) {
            return undefined;
        } else {
            try {
                const jsonValue = JSON.parse(localStorageValue);
                // tslint:disable-next-line:no-null-keyword
                if (jsonValue === null) {
                    return undefined;
                }
                return jsonValue;
            } catch (e) {
                return undefined;
            }
        }

    }
    set(key: string, value: {}) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

