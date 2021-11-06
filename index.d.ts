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
     * @example
     * save.set("Some new key", "Some new value");
     */
    set(key: key, value: value) : ValueSaver;

    /**
     * Get a value by the key
     * @param key The key of the value you want to receive
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
    keyByValue(value: value) : [string];

    /**
     * Filter the ValueSaver for specified keys or values
     * @param listener The function to filter
     * @returns {object}
     * @example
     * save.filter(f => f.key === "Some new key");
     * // Returns {"Some new key": "Some new value"}
     */
    filter(listener: (f : {key: key, value: value}) => void) : {};

    /**
     * Convert the ValueSaver to an array.
     * @returns {object}
     * @example
     * save.toArray();
     * // Returns [{"Some key": "Some value"}, {"Some new key": "Some new value"}]
     */
    toArray() : [{}];

    /**
     * Clears the ValueSaver
     * @example
     * save.clear();
     */
    clear() : ValueSaver;

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
     * @example
     * save.writeValueSaver({"key": "A totally new key", "value": "A totally new value"});
     */
    writeValueSaver(array: object) : ValueSaver;

    /**
     * Insert a new key and value by using an object.
     * @param object The object to insert
     * @example
     * save.insertValue({"key": "Wow", "value": "Another wow"});
     */
    insertValue(...objects: object) : ValueSaver;

    /**
     * Import a saved version of a ValueSaver.
     * @param id The custom id of the saved ValueSaver.
     * @returns {boolean}
     * @example
     * save.import(123);
     */
    import(id: id) : ValueSaver;

    /**
     * Save the ValueSaver to a JSON file to import it later again.
     * @param id The custom id of the ValueSaver to save.
     * @param concat (Optional: default false) If there already exists a save with the same id it should concat the ValueSavers together.
     * @example
     * save.save(123, true);
     */
    save(id: id, concat: boolean) : ValueSaver;

    /**
     * Removes the save of the ValueSaver.
     * @returns {boolean}
     * @example
     * save.removesave();
     */
    removeSave() : Promise<ValueSaver>;

    /**
     * Removes all the saves of the ValueSavers.
     * @example
     * save.removeAllSaves();
     */
    removeAllSaves() : ValueSaver;

    /**
     * Get all id's of the saved ValueSavers.
     * @returns {object}
     */
    getAllSaves() : [id];

    /**
     * Returns the first value of the ValueSaver.
     */
    first() : value;

    /**
     * Returns the first key of the ValueSaver.
     */
    firstKey() : key;

    /**
     * Returns the last value of the ValueSaver.
     */
    last() : value;

    /**
     * Returns the last key of the ValueSaver.
     */
    lastKey() : key;

    /**
     * Concat two different ValueSavers together to one ValueSaver
     * @param ValueSaver The ValueSaver to concat together
     */
    concat(ValueSaver: ValueSaver) : ValueSaver;

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
