/**
 * My own interface to talk with Storage object in JavaScript, like localStorage or sessionStorage
 */
export default interface IStorage {

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
    set(key: string, value: {}): void;

    /**
     * Removes value at given key
     *
     * @param {string} key
     *
     * @memberOf IStorage
     */
    remove(key: string): void;

    /**
     * Clears whole storage from data
     */
    clear(key: string): void;
}
