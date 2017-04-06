import * as _ from 'lodash';
import { IStorage } from './IStorage';
export default class StorageFacade implements IStorage {
    private storage: Storage;
    
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
        if (_.isEmpty(storageValue)) {
            return undefined;
        } else {
            try {
                const jsonValue = JSON.parse(storageValue);
                if (_.isNull(jsonValue)) {
                    return undefined;
                }
                return jsonValue;
            } catch (e) {
                return undefined;
            }
        }
    }
    set(key: string, value: {}): void {
        this.storage.setItem(key, JSON.stringify(value));
    }
}
