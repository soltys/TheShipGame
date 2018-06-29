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
            return {};
        } else {
            try {
                if (storageValue === null) {
                    return {};
                }
                const jsonValue = JSON.parse(storageValue);
                if (jsonValue === null) {
                    return {};
                }
                return jsonValue;
            } catch (e) {
                return {};
            }
        }
    }
    set(key: string, value: {}): void {
        this.storage.setItem(key, JSON.stringify(value));
    }
}
