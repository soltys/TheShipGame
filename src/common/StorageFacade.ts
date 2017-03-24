import * as _ from 'lodash';
import { IStorage } from './IStorage';
export default class StorageFacade implements IStorage {
    private storage: Storage;
    /**
     * Creates instance or gets one which exists already
     */
    constructor(storage: Storage) {
        this.storage = storage;
    }

    remove(key: string) {
        this.storage.removeItem(key);
    }
    clear() {
        this.storage.clear();
    }

    get(key: string): {} {
        const storageValue = this.storage.getItem(key);
        if (_.isEmpty(localStorage)) {
            return undefined;
        } else {
            try {
                const jsonValue = JSON.parse(storageValue);
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
        this.storage.setItem(key, JSON.stringify(value));
    }
}

