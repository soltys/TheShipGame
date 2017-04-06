import * as _ from 'lodash';
class Dictionary<TKey, TValue>  {

    _keys: TKey[];
    _values: TValue[];

    constructor(init?: { key: TKey; value: TValue; }[]) {
        this._keys = [];
        this._values = [];
        if (init) {
            for (var x = 0; x < init.length; x++) {
                this[_.toString(init[x].key)] = init[x].value;
                this._keys.push(init[x].key);
                this._values.push(init[x].value);
            }
        }
    }

    add(key: TKey, value: TValue) {
        if (this.containsKey(key)) {
            throw new Error('Dictionary already contains this key');
        }
        this[_.toString(key)] = value;
        this._keys.push(key);
        this._values.push(value);
    }

    remove(key: TKey) {
        var index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);

        delete this[_.toString(key)];
    }

    keys(): TKey[] {
        return this._keys;
    }

    values(): TValue[] {
        return this._values;
    }

    containsKey(key: TKey) {
        if (_.isUndefined(this[key.toString()])) {
            return false;
        }

        return true;
    }
}

export default Dictionary;
