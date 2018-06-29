/**
 * Returns random integer between min and max
 *
 * @export
 * @param {number} min lower bound
 * @param {number} max upper bound
 * @returns {number} random number between min and max
 */
export function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * isEmpty(null)
 * // => true
 *
 * isEmpty(true)
 * // => true
 *
 * isEmpty(1)
 * // => true
 *
 * isEmpty([1, 2, 3])
 * // => false
 *
 * isEmpty('abc')
 * // => false
 *
 * isEmpty({ 'a': 1 })
 * // => false
 */
export function isEmpty(value: any) {
    if (value === null) {
        return true;
    }
    if ((Array.isArray(value) || typeof value === 'string' || typeof value.splice === 'function')) {
        return !value.length;
    }

    for (const key in value) {
        if (value.hasOwnProperty.call(value, key)) {
            return false;
        }
    }
    return true;
}
