import * as Immutable from "immutable";
import _ from "lodash";

// -----------------------------------------------------------------------------------------
// #region Private Methods
// -----------------------------------------------------------------------------------------

/**
 * Compare two collections by a property of each value,
 * specified by selector, not considering the order of
 * elements, as long as all elements of one exist in the
 * other.
 * @param selector a function taking the item of the array and returning a property.
 * @param array1 first array to compare.
 * @param array2 second array to compare.
 * @returns true if both arrays contain all the same elements of the other,
 *          not considering order, false otherwise.
 */
const _equalsBy = function<T, V>(
    selector: (element: T) => V,
    array1: Array<T> | Immutable.List<any> | undefined,
    array2: Array<T> | Immutable.List<any> | undefined
) {
    if (array1 == null) {
        return array2 == null;
    }

    if (array2 == null) {
        return false;
    }

    if (_length(array1) !== _length(array2)) {
        return false;
    }

    const hasDifferingValues =
        array1.some(
            (s: T) => !array2.some((ss: T) => selector(s) === selector(ss))
        ) ||
        array2.some(
            (s: T) => !array1.some((ss: T) => selector(s) === selector(ss))
        );

    return !hasDifferingValues;
};

/**
 * Creates an array of unique array values not included in the other provided arrays using SameValueZero for
 * equality comparisons.
 *
 * @param array The array to inspect.
 * @param values The arrays of values to exclude.
 * @return Returns the new array of filtered values.
 */
const _difference = <T>(
    array: Array<T> | null | undefined,
    ...values: Array<Array<T>>
): T[] => _.difference(array, ...values);

/**
 * Recursively flattens a nested array.
 *
 * @param array The array to recursively flatten.
 * @return Returns the new flattened array.
 */
const _flattenDeep = <T>(array: Array<T> | null | undefined): T[] =>
    _.flattenDeep(array);

/**
 * Checks for values in a collection/object. Returns false if the collection is undefined, null,
 * or the respective object type's "empty" state, ie length 0, size 0, or has no keys.
 *
 * Uses ... syntax to allow a single collection or multiple collections to be passed in, ie
 * CollectionUtils.hasValues([]) or CollectionUtils.hasValues([], [], [])
 *
 * @param {(...Array<(any[] | Immutable.List<any>)} collections
 * @returns {boolean} False if `collections` is null/undefined, or every element is also null/undefined,
 * or has no sub-elements. True if any element has sub-elements.
 */
const _hasValues = (
    ...collections: Array<any[] | Immutable.List<any> | undefined>
): boolean => {
    let hasValues = false;
    collections.forEach(
        (collection: any[] | Immutable.List<any> | undefined) => {
            if (!_isEmpty(collection)) {
                hasValues = true;
            }
        }
    );
    return hasValues;
};

/**
 * Checks for values in a collection/object. Returns true if the collection is undefined, null,
 * or the respective object type's "empty" state, ie length 0, size 0, or has no keys.
 *
 * Uses ... syntax to allow a single collection or multiple collections to be passed in, ie
 * CollectionUtils.isEmpty([]) or CollectionUtils.isEmpty([], [], [])
 *
 * @param {(...Array<(any[] | Immutable.List<any>)} collections
 * @returns {boolean} True if `collections` is null/undefined, or every element is also null/undefined,
 * or has no sub-elements. False if any element has sub-elements.
 */
const _isEmpty = (
    ...collections: Array<any[] | Immutable.List<any> | undefined>
): boolean => {
    let isEmpty = true;

    collections.forEach(
        (collection: any[] | Immutable.List<any> | undefined) => {
            if (collection == null) {
                return;
            }
            if (collection instanceof Immutable.List) {
                const collectionList = collection as Immutable.List<any>;
                if (collectionList.size !== 0) {
                    isEmpty = false;
                }
            } else {
                const collectionArray = collection as any[];
                if (collectionArray.length !== 0) {
                    isEmpty = false;
                }
            }
        }
    );

    return isEmpty;
};

/**
 * Checks if there aren't any values in a collection/object. Returns false if the collection is undefined, null,
 * or the respective object type's "empty" state, ie length 0, size 0, or has no keys.
 *
 * Uses ... syntax to allow a single collection or multiple collections to be passed in, ie
 * CollectionUtils.isNotEmpty([]) or CollectionUtils.isNotEmpty([], [], [])
 *
 * @param {(...Array<(any[] | Immutable.List<any>)} collections
 * @returns {boolean} False if `collections` is null/undefined, or every element is also null/undefined,
 * or has no sub-elements. True if any element has sub-elements.
 */
const _isNotEmpty = (
    ...collections: Array<any[] | Immutable.List<any> | undefined>
): boolean => {
    return !_isEmpty(...collections);
};

/**
 * Utility function to get the length of a collection
 * when the collection might be either a Immutable.List or an Array
 * @param arr the collection
 * @returns number the length of the collection
 */
const _length = (arr: Array<any> | Immutable.List<any>): number => {
    if (arr == null) {
        return -1;
    }

    if (arr instanceof Immutable.List) {
        return (arr as Immutable.List<any>).size;
    }

    return (arr as Array<any>).length;
};

/**
 * Gets the first element of array.
 *
 * @alias _.first
 *
 * @param array The array to query.
 * @return Returns the first element of array.
 */
const _head = <T>(array: Array<T> | null | undefined): T | undefined =>
    _.head(array);

/**
 * Creates an array of  unique values that are included in all of the provided arrays using SameValueZero for
 * equality comparisons.
 *
 * @param arrays The arrays to inspect.
 * @return Returns the new array of shared values.
 */
const _intersection = <T>(...arrays: Array<Array<T>>) =>
    _.intersection(...arrays);

/**
 * Creates an array of unique `array` values not included in the other
 * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @category Array
 * @param array
 * @param [values] The arrays to inspect.
 * @param [comparator] The comparator invoked per element.
 * @returns Returns the new array of filtered values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];

 * _.intersectionWith(objects, others, _.isEqual);
 * => [{ 'x': 1, 'y': 2 }]
 */
const _intersectionWith = <T1, T2>(
    array: Array<T1>,
    values: Array<T2>,
    comparator: (a: T1, b: T2) => boolean
): T1[] => _.intersectionWith(array, values, comparator);

/**
 * Removes a supplied element by index
 * @param source original array
 * @param index array index to remove
 */
const _removeElementAt = <T>(source: Array<T>, index: number): Array<T> => {
    if (index < 0 || index > source.length) {
        return source;
    }

    const newArr = [...source];
    newArr.splice(index, 1);
    return newArr;
};

/**
 * Returns a NEW array with the element at the specified index
 * replaced with the specified value if the index provided is
 * greater than zero, else it returns the source array. Since it returns a new array,
 * this can be safely used as the value for a React.SetStateAction
 * i.e. setMyArray(CollectionUtils.replaceElementAt(myArray, index, newValue));
 * @param source
 * @param index
 * @param value
 */
const _replaceElementAt = <T>(
    source: Array<T>,
    index: number,
    value: T
): Array<T> => {
    if (source.length === 0 || index < 0) {
        return source;
    }
    if (source.length === 1) {
        return [value];
    }

    if (index === source.length - 1) {
        return [...source.slice(0, index), value];
    }

    return [...source.slice(0, index), value, ...source.slice(index + 1)];
};

/**
 * Gets a random element from collection.
 *
 * @param collection The collection to sample.
 * @return Returns the random element.
 */
const _sample = <T>(collection: Array<T> | null | undefined): T | undefined =>
    _.sample(collection);

/**
 * Gets n random elements at unique keys from collection up to the size of collection.
 *
 * @param collection The collection to sample.
 * @param n The number of elements to sample.
 * @return Returns the random elements.
 */
const _sampleSize = <T>(
    collection: Array<T> | null | undefined,
    n?: number
): T[] => _.sampleSize(collection, n);

/**
 * Sort an array of items alphabetically by one property of the item.
 * @param array the source array of items
 * @param selector function returning property to sort by from item
 * @param caseSensitive whether to consider letter case when sorting
 */
const _sortByString = <T extends any>(
    array: Array<T>,
    selector: (element: T) => string,
    caseSensitive: boolean = false
) =>
    array.sort((a: T, b: T) => {
        let aString = selector(a);
        let bString = selector(b);

        if (!caseSensitive) {
            aString = aString?.toLowerCase();
            bString = bString?.toLowerCase();
        }

        if (aString === "" || aString == null) {
            return 1;
        }

        if (bString === "" || bString == null) {
            return -1;
        }

        if (aString === bString) {
            return 0;
        }

        if (aString < bString) {
            return -1;
        }

        return 1;
    });

/**
 * Creates a slice of array with n elements taken from the beginning.
 *
 * @param array The array to query.
 * @param n The number of elements to take.
 * @return Returns the slice of array.
 */
const _take = <T>(array: Array<T> | null | undefined, n?: number): T[] =>
    _.take(array, n);

// #endregion Private Methods

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const CollectionUtils = {
    difference: _difference,
    equalsBy: _equalsBy,
    first: _head,
    flattenDeep: _flattenDeep,
    hasValues: _hasValues,
    isEmpty: _isEmpty,
    isNotEmpty: _isNotEmpty,
    intersection: _intersection,
    intersectionWith: _intersectionWith,
    length: _length,
    removeElementAt: _removeElementAt,
    replaceElementAt: _replaceElementAt,
    sample: _sample,
    sampleSize: _sampleSize,
    sortByString: _sortByString,
    take: _take,
};

// #endregion Exports
