type key = number | string;

type value = any;

type id = number | string;

export class ValueSaver{
    /**
     * Create a ValueSaver
     * @param array An array to import as key => value (not required)
     * @example
     * const save = new ValueSaver([{"key": "Some key", "value": "Some value"}]);
     */
    constructor(array: object);

    /**
     * Set a value by a key
     * @param key The key of the value you want to save
     * @param value The value you want to save
     * @returns {ValueSaver}
     * @example
     * save.set("Some new key", "Some new value");
     */
    set(key: key, value: value) : ValueSaver;

    /**
     * Get a value by the key
     * @param key The key of the value you want to receive
     * @returns {value | boolean}
     * @example
     * save.get("Some key");
     * // Returns "Some value"
     */
    get(key: key) : value | boolean;

    /**
     * Delete a value by the key
     * @param key The key of the value that you want to delete
     */
    delete(key: key) : ValueSaver;

    /**
     * Get a key by it's value
     * @param value The value where you want it's key from
     * @returns {Array}
     * @example
     * save.keyByValue("Some new value");
     * // Returns ["Some new key"]
     */
    keyByValue(value: value) : [{key: key, value: value}];

    /**
     * Returns the first value of the ValueSaver.
     * @returns {value | null}
     * @example
     * const save = new ValueSaver();
     * save.first();
     */
    first() : value;

    /**
     * Returns the first key of the ValueSaver.
     * @returns {key | null}
     * @example
     * const save = new ValueSaver();
     * save.firstKey();
     */
    firstKey() : key;

    /**
     * Returns the last value of the ValueSaver.
     * @returns {value | null}
     * @example
     * const save = new ValueSaver();
     * save.last();
     */
    last() : value;

    /**
     * Returns the last key of the ValueSaver.
     * @returns {key | null}
     * @example
     * const save = new ValueSaver();
     * save.lastKey();
     */
    lastKey() : key;

    /**
     * Filter the ValueSaver for specific keys or values
     * @param listener The function to filter
     * @returns {ValueSaver}
     * @example
     * save.filter(f => f.key === "Some new key");
     * // Returns new ValueSaver
     */
    filter(listener: (f : {key: key, value: value}) => void) : ValueSaver;

    /**
     * Filter the ValueSaver for specific keys or values
     * @param listener The function to filter
     * @returns {ValueSaver}
     * @example
     * save.filter(f => f.key === "Some new key");
     * // Returns [{"Some new key": "Some new value"}]
     */
    filterArray(listener: (f: {key: key, value: value}) => void) : [{}];

    /**
     * Convert the ValueSaver to an array.
     * @returns {object}
     * @example
     * save.toArray();
     * // Returns [{"Some key": "Some value"}, {"Some new key": "Some new value"}]
     */
    toArray() : [{}];

    /**
     * Convert the ValueSaver to a Map
     * @returns {Map}
     * @example
     * save.toMap();
     * // Returns Map(1) {'Some key' => 'Some value', 'Some new key' => 'Some new value'}
     */
    toMap() : Map;

    /**
     * Get all the values by the for each function
     * @param listener The function to use the for each
     * @returns {value}
     * @example
     * save.forEach(value => {
     *    console.log(value);
     *    // Logs every value
     * });
     */
    forEach(listener: (f : value) => value) : ValueSaver;

    /**
     * Convert the ValueSaver to a readable array for the ValueSaver.
     * @returns {object}
     * @example
     * save.toReadableArray();
     * // Returns [{"key": "Some key", "value": "Some value"}, {"key": "Some new key", "value": "Some new value"}]
     */
    toReadableArray() : [{"key": key, "value": value}];

    /**
     * Overwrite the ValueSaver by a readable array.
     * @param array The array 
     * @returns {ValueSaver}
     * @example
     * save.writeValueSaver({"key": "A totally new key", "value": "A totally new value"});
     */
    writeValueSaver(array: object) : ValueSaver;

    /**
     * Insert a new key and value by using an object.
     * @param object The object to insert
     * @returns {ValueSaver}
     * @example
     * save.insertValue({"key": "Wow", "value": "Another wow"});
     */
    insertValue(...objects: object) : ValueSaver;

    /**
     * Import a saved version of a ValueSaver.
     * @param id The custom id of the saved ValueSaver.
     * @returns {ValueSaver | boolean}
     * @example
     * save.import(123);
     */
    import(id: id) : Promise<ValueSaver | boolean>;

    /**
     * Save the ValueSaver to a JSON file to import it later again.
     * @param id The custom id of the ValueSaver to save.
     * @param concat (Optional: default false) If there already exists a save with the same id it should concat the ValueSavers together.
     * @example
     * save.save(123, true);
     */
    save(id: id, concat: boolean) : Promise<ValueSaver>;

    /**
     * Concat two different ValueSavers together to one ValueSaver
     * @param ValueSaver The ValueSaver to concat together
     * @returns {ValueSaver}
     * @example
     * const save1 = new ValueSaver();
     * save1.set(`Some key`, `Some value`);
     * const save2 = new ValueSaver();
     * save2.set(`Some other key`, `Some other value`);
     * const save3 = save1.concat(save2);
     * // Returns new ValueSaver
     */
    concat(ValueSaver: ValueSaver) : ValueSaver;

    /**
     * Concat two different ValueSavers together to one ValueSaver
     * @param ValueSaver The ValueSaver to concat together
     * @returns {Array}
     * @example
     * const save1 = new ValueSaver();
     * save1.set(`Some key`, `Some value`);
     * const save2 = new ValueSaver();
     * save2.set(`Some other key`, `Some other value`);
     * const save3 = save1.concat(save2);
     * // Returns array
     */
    concatArray(ValueSaver: ValueSaver) : [{}];

    /**
     * Reduce a ValueSaver
     * @param listener The callback to set the initialValue
     * @param initialValue The value to start with
     * @returns {any}
     * @example
     * var newArray = save.reduce((array, item) => {
     *    array.push(item.value);
     *    return array;
     * }, []);
     */
    reduce(listener: (previousValue: any, currentValue: {key: key, value: value}, index: number, array: [{key: key, value: value}]) => void, initialValue: value) : any;

    /**
     * Map the ValueSaver to an Array
     * @param listener The callback to create a filter
     * @returns {Array}
     * @example
     * const save = new ValueSaver();
     * const array = save.map(i => i.value.startsWith('Some'));
     * // Returns an Array
     */
    map(listener: (f : {key: key, value: value}) => void) : [];

    /**
     * Removes the save of the ValueSaver.
     * @returns {Promise<ValueSaver>}
     * @example
     * save.removesave();
     */
    removeSave() : Promise<ValueSaver>;

    /**
     * Removes all the saves of the ValueSavers.
     * @returns {ValueSaver}
     * @example
     * save.removeAllSaves();
     */
    removeAllSaves() : Promise<ValueSaver>;

    /**
     * Check whether a value exists in the ValueSaver or not.
     * @param value The value you want to check whether it exists or not.
     * @returns {boolean}
     * @example
     * save.hasValue("Some new value");
     * // Returns true
     */
    hasValue(value: value) : boolean;

    /**
     * Create a ValueSaver from an Array
     * @param array The array where you want to create a ValueSaver from
     * @returns {ValueSaver}
     * const arr = [{'Some key': 'Some value'}];
     * const save = new ValueSaver();
     * save.fromArray(arr);
     * // Returns a new ValueSaver
     */
    fromArray(array: []) : ValueSaver;

    /**
     * Create a ValueSaver from a Map
     * @param map The Map where you want to create a ValueSaver from
     * @returns {ValueSaver}
     * const map = new Map();
     * map.set('test', 'test');
     * const save = new ValueSaver();
     * save.fromMap(map);
     * // Returns a new ValueSaver
     */
    fromMap(map: Map) : ValueSaver;

    /**
     * Clears the ValueSaver
     * @returns {ValueSaver}
     * @example
     * save.clear();
     */
    clear() : ValueSaver;

    /**
     * Get all id's of the saved ValueSavers.
     * @returns {Array}
     */
    getAllSaves() : [id];

    /**
     * The ValueSaver class so you can import it as a module or as class
     * @returns {ValueSaver}
     * @example
     * const ValueSaver = require("valuesaver");
     * const { ValueSaver } = require("valuesaver");
     * // Works both
     */
    ValueSaver: ValueSaver;

    /**
     * The size of the ValueSaver
     * @example
     * save.size;
     * // Returns 2
     */
    readonly size: number;

    /**
     * The readable array for the ValueSaver.
     */
    private readonly _array;

    /**
     * The custom id of the ValueSaver when it got saved or imported.
     */
    private readonly _id;

    /**
     * The ValueSaver info.
     */
    private readonly __ValueSaverInfo;
}

declare module 'ValueSaver'{
    export = ValueSaver;
}
