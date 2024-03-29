[![downloadsBadge](https://img.shields.io/npm/dt/valuesaver?style=for-the-badge)](https://npmjs.com/package/valuesaver)
[![versionBadge](https://img.shields.io/npm/v/valuesaver?style=for-the-badge)](https://npmjs.com/package/valuesaver)
[![documentationBadge](https://img.shields.io/badge/Documentation-Click%20here-blue?style=for-the-badge)](https://github.com/Luuk-Dev/ValueSaver#readme)
# ValueSaver
A way to easily save your values with a key.

## What is ValueSaver?
ValueSaver is an easy to use framework to easily save values by using a key. You can set values, get values, delete values and so much more.

## Differences between ValueSaver and Map
The ValueSaver looks like a Map. The differences are tho that the ValueSaver is more flexibel and has more options. So it is for example possible to save your values with a custom id and import it again with the same custom id.

## The use of the ValueSaver

### Creating a ValueSaver
As the ValueSaver is just like a Map a class you can create one by using
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
```
You can also insert values by using an array in the first argument by creating a ValueSaver. In the array you must put at least one JSON object. Every JSON object requires a `key` and a `value`.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver([{"key": "Some key", "value": "Some value"}]);
``` 

### Setting a value
You can just like the Map class set a value by using the `set` function. The first parameter will be seen as the key and the second parameter will be seen as the value. These value's can be accessed by using their key in the get function.
> Note: By using the same key twice it will overwrite the last value. A key may only be a string or a number, a value may only be a string, number or an object.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);
```

### Getting a value
You can get a value by calling the key in the `get` function. The first key will be seen as the key and the function will return the value.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

console.log(save.get(`Some key`));
// Output: Some value
```

### Deleting a value
You can delete a value by using the `delete` function. The first parameter will be seen as the key.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

console.log(save.get(`Some key`));

if(save.delete(`Some key`)) console.log(`Successfully deleted the value with the key 'Some key'!`);
else console.log(`The value with the key 'Some key' does not exist!`);
```

### Checking if a value exists
You can check if a value exists by using the `hasValue` function. The first parameter is the value where you want to look for. The function will return a boolean.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

if(save.hasValue(`Some value`)) console.log(`The value exists!`);
else console.log(`The value does not exist!`);
```

### Clearing a ValueSaver
You can clear a ValueSaver by using the clear function.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

save.clear();
```

### Getting a key by the value
It's sometime frustrating that you don't know the key anymore. You can use the `keyByValue` function to get all the keys that have this value. The first parameter will be seen as the value. The function returns an array of all the key's.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

console.log(save.keyByValue(`Some value`));
// Output: [{key: "Some key", value: "Some value"}]
```

### Filter
You can use a filter to filter through the values. The filter required a function to filter. You can filter by key and by value.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

console.log(save.filter(s => s.key === "Some key" && s.value === "Some value"));
// Output new ValueSaver with the keys and values
```

### Filter array
You can use a filter array to filter through the values. The filter required a function to filter. You can filter by key and by value.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

console.log(save.filterArray(s => s.key === "Some key" && s.value === "Some value"));
// [{key: "Some key", value: "Some value"}]
```

### Foreach function
You can use the foreach function which will call the callback for every value. The first parameter will be seen as the callback and must be a function.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

save.forEach(value => console.log(value));
// Output: Some value
```

### Reduce function
You can use the reduce function which will call the callback for every value. The first parameter will be seen as the callback and must be a function. The second parameter is the start value.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

var value = save.reduce((str, item) => {
    str += item;
    return str;
}, ``);
// Output: Some value
```

### Map function
You can use the map function which will call the callback for every value. The first parameter will be seen as the callback and must be a function.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, {someBoolean: true});
save.set(`Some other key`, {someBoolean: false});

var booleans = save.map(item => item.someBoolean);
// Output: [true, false]
```

## Concat function
You can concat two ValueSaver's together to one ValueSaver. The function requires one parameter which is the other ValueSaver to concat.
```js
const {ValueSaver} = require('valuesaver');
const save1 = new ValueSaver();
const save2 = new ValueSaver();
save1.set(`Some key`, `Some value`);
save2.set(`Some other key`, `Some other value`);

var newValueSaver = save1.concat(save2);
// Output: new ValueSaver with both ValueSaver's keys and values
```

## Concat array function
You can concat two ValueSaver's together to one array. The function requires one parameter which is the other ValueSaver to concat.
```js
const {ValueSaver} = require('valuesaver');
const save1 = new ValueSaver();
const save2 = new ValueSaver();
save1.set(`Some key`, `Some value`);
save2.set(`Some other key`, `Some other value`);

var newValueSaver = save1.concatArray(save2);
// Output: [{"Some key": "Some value"}, {"Some other key": "Some other value"}]
```

### ValueSaver to array
You can easily convert a ValueSaver to an array by using the `toArray` function.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

console.log(save.toArray());
// Output: [{"Some key": "Some value"}]
```

### ValueSaver to Map
You can easily convert a ValueSaver to a Map by using the `toMap` function.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

console.log(save.toMap());
// Output: Map(1) {'Some key' => 'Some value'}
```

### Readable array ValueSaver
You can convert the ValueSaver to a readable array for the ValueSaver. The array can be used for a new ValueSaver or to overwrite a ValueSaver.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

console.log(save.toReadableArray());
// Output: [{"key": "Some key", "value": "Some value"}]
```

### Overwrite ValueSaver with an array
You can overwrite a ValueSaver with an array. This must be a readable array just like the output of the `toReadableArray` function.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

save.writeValueSaver([{"key": "New key", "value": "New value"}]);
console.log(save.toArray());
// Output: [{"New key": "New value"}]
```

### Create new ValueSaver from an array
You can create a new ValueSaver with an array by using the `fromArray` function. The function requires one parameter which is the array.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
const array = [{'Some key': 'Some value'}];
const newValueSaver = save.fromArray(array);

console.log(newValueSaver.toArray());
// Output: [{"Some key": "Some value"}]
```

### Create new ValueSaver from a Map
You can create a new ValueSaver with a map by using the `fromMap` function. The function requires one parameter which is the map.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
const map = new Map();
map.set('Some key', 'Some value');
const newValueSaver = save.fromMap(map);

console.log(newValueSaver.toArray());
// Output: [{"Some key": "Some value"}]
```

### Insert key's and value's with an object
To insert a new key with a new value you can use the `insertValue` function. The first parameter must be an object with a key and a value.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

save.insertValue({"key": "Some extra key", "value": "Some extra value"});
console.log(save.toArray());
// Output: [{"Some key": "Some value"}, {"Some extra key": "Some extra value"}]
```

### Import a ValueSaver with an id
To import a ValueSaver with an id you can use the `import` function. The function requires an id which is a string or a number. The id is the custom id that you create by saving it.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

(async () => {
    var import = await save.import(123);
    if(import) console.log(`Imported the ValueSaver with the id 123`);
    else console.log(`The ValueSaver with the id 123 does not exist.`);
})();
```

### Saving a ValueSaver with an id
By saving a ValueSaver you will be able to use it again when your NodeJS server was offline for example. You can use the `import` function to use it again. The `save` function requires a custom id which is the first parameter. The second parameter is the `concat` parameter. If there is already another ValueSaver saved with this id will it by default overwrite the other ValueSaver. By setting the `concat` parameter to `true` it will concat the two ValueSavers to one ValueSaver.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

(async () => {
    await save.save(123, true);
    console.log(`Saved the ValueSaver with the custom id 123`);
})();
```

### Getting all saved saves
If you forgot a save, you can use the function `getAllSaves` to get all the saved ValueSavers. It will return an array with all the id's of the saved ValueSavers.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

save.save(123);
console.log(save.getAllSaves());
// Output: [123]
```

### Removing a save
You can remove a save by saving it or importing it and then use the `removeSave` function. It will return a Promise which will be fullfilled once the save has been deleted.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

save.import(123);
(async () => {
    await save.removeSave();
})();
```

### Removing all saves
You can remove all saves by using the `removeAllSaves` function. This function will remove all saves from all ValueSavers that have been saved.
```js
const {ValueSaver} = require('valuesaver');
const save = new ValueSaver();
save.set(`Some key`, `Some value`);

(async () => {
    await save.removeAllSaves();
})();
```
