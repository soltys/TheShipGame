export interface IStorage {
    
    /**
     * Gets value at given key
     * 
     * @param {string} key
     * @returns {{}}
     * 
     * @memberOf IStorage
     */
    get(key: string): {};

    /**
     * Sets valuee at given key
     * 
     * @param {string} key
     * @param {{}} value
     * 
     * @memberOf IStorage
     */
    set(key: string, value: {});

    /**
     * Removes value at given key
     * 
     * @param {string} key
     * 
     * @memberOf IStorage
     */
    remove(key: string);

    /**
     * Clears whole storage from data
     */
    clear(key: string);
}
