import * as Utils from '@core/Utils';
import IStorage from '@core/IStorage';
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
        if (Utils.isEmpty(storageValue)) {
            return undefined;
        } else {
            try {
                const jsonValue = JSON.parse(storageValue);
                if (jsonValue === null) {
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
