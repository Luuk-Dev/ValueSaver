const fs = require('fs/promises');
const { constants, existsSync } = require('fs');
const path = require('path');
var ids = require('./src/ids.json');
const {ERRORS, WARNINGS, INFO} = require('./src/constants.json');
const wait = require('./src/wait.js');
const random = require('./src/random');

(async () => {
    if(!existsSync(path.join(__dirname, `./src`))) throw new Error(`Please re-install ValueSaver. The source folder doesn't exists which is required in order to functionate.`);
    else if(!existsSync(path.join(__dirname, `./src/saves`))){
        try{
            await fs.mkdir(path.join(__dirname, `./src/saves`));
        } catch (err){
            return console.warn(`\x1b[33m%s\x1b[0m`, err);
        }
    } else {
        for(var i = 0; i < ids.length; i++){
            await wait(100);
            try{
                await fs.access(path.join(__dirname, ids[i].src), constants.F_OK);
            } catch(err){
                try{
                    await fs.writeFile(path.join(__dirname, ids[i].src), JSON.stringify([]));
                } catch(err_write){
                    return console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_SAVE_NOT_FOUND.split('[SAVE_ID]').join(ids[i].id));
                }
            }
        }
    }
})();

class ValueSaver {
    constructor(array){
        this._array = [];
        this.size = 0;
        this._id = null;
        this.__ValueSaverInfo = INFO;
        if(typeof array === 'object' && Array.isArray(array)){
            if(array.filter(r => r.key).length < array.length || array.filter(r => r.value).length < array.length) throw new TypeError(`\x1b[31m${ERRORS.INVALID_ARRAY}`);
            for(var i = 0; i < array.length; i++){
                var item = array[i];
                if(typeof item.key === 'undefined') continue;
                this.set(item.key, (item.value || undefined));
            }
            this.size = this._array.length;
        }
    }
    set(key, value){
        if(typeof key !== 'string' && typeof key !== 'number') throw new TypeError(`\x1b[31m${ERRORS.INVALID_KEY}`);
        const key_validation = this._array.filter(r => r.key === key);
        if(key_validation.length > 0){
            key_validation[0].value = value;
        } else {
            this._array.push({"key": key, "value": value});
        }
        this.size = this._array.length;
        return this;
    }
    get(key){
        if(typeof key !== 'string' && typeof key !== 'number') throw new TypeError(`\x1b[31m${ERRORS.INVALID_KEY}`);
        const key_validation = this._array.filter(r => r.key === key);
        if(key_validation.length > 0) return key_validation[0].value;
        else return undefined;
    }
    delete(key){
        if(typeof key !== 'string' && typeof key !== 'number') throw new TypeError(`\x1b[31m${ERRORS.INVALID_KEY}`);
        const key_validation = this._array.filter(r => r.key === key);
        if(key_validation.length > 0){
            const index = this._array.indexOf(key_validation[0])
            this._array.splice(index, 1);
            this.size = this._array.length;
            return this;
        } else {
            return false;
        }
    }
    keyByValue(value){
        const key_validation = this._array.filter(r => r.value === value);
        if(key_validation.length > 0){
            const arr = [];
            for(var i = 0; i < key_validation.length; i++){
                const save = key_validation[i];
                arr.push(save);
            }
            return arr;
        } else return [];
    }
    first(){
        const _first = this._array[0];
        if(!_first) return null;
        else return _first.value;
    }
    firstKey(){
        const _first = this._array[0];
        if(!_first) return null;
        else return _first.key;
    }
    last(){
        if(this._array.length === 0) return null;
        const _last = this._array[this._array.length - 1];
        return _last.value;
    }
    lastKey(){
        if(this._array.length === 0) return null;
        const _last = this._array[this._array.length - 1];
        return _last.key;
    }
    filter(filter){
        if(typeof filter !== 'function') throw new TypeError(`\x1b[31m${ERRORS.INVALID_FILTER}`);
        const set_filter = this._array.filter(filter);
        const newValueSaver = new ValueSaver();
        if(set_filter.length > 0){
            for(var i = 0; i < set_filter.length; i++){
                const key = set_filter[i].key;
                const value = set_filter[i].value;
                newValueSaver.set(key, value);
            }
        }
        return newValueSaver;
    }
    filterArray(filter){
        if(typeof filter !== 'function') throw new TypeError(`\x1b[31m${ERRORS.INVALID_FILTER}`);
        const set_filter = this._array.filter(filter);
        const arr = [];
        if(set_filter.length > 0){
            for(var i = 0; i < set_filter.length; i++){
                const key = set_filter[i].key;
                const value = set_filter[i].value;
                const obj = {};
                obj[key] = value;
                arr.push(obj);
            }
        }
        return arr;
    }
    toArray(){
        const arr = [];
        for(var i = 0; i < this._array.length; i++){
            const _item = this._array[i];
            const obj = {};
            obj[_item.key] = _item.value;
            arr.push(obj);
        }
        return arr;
    }
    toMap(){
        const map = new Map();
        for(var i = 0; i < this._array.length; i++){
            const _item = this._array[i];
            map.set(_item.key, _item.value);
        }
        return map;
    }
    forEach(callback){
        if(typeof callback !== 'function') throw new TypeError(`\x1b[31m${ERRORS.INVALID_CALLBACK}`);
        for(var i = 0; i < this._array.length; i++){
            const _item = this._array[i];
            callback.call(this, _item.value);
        }
        return this;
    }
    toReadableArray(){
        const arr = [];
        for(var i = 0; i < this._array.length; i++){
            const item = this._array[i];
            arr.push(item);
        }
        return arr;
    }
    writeValueSaver(array){
        if(typeof array !== 'object') throw new TypeError(`\x1b[31m${ERRORS.INVALID_ARRAY_TYPE}`);
        if(array.filter(r => r.key).length < array.length || array.filter(r => r.value).length < array.length) throw new TypeError(`\x1b[31m${ERRORS.INVALID_ARRAY}`);
        this._array = array;
        this.size = this._array.length;
        return this;
    }
    insertValue(...objects){
        if(objects.forEach(ob => typeof ob !== 'object')) throw new TypeError(`\x1b[31m${ERRORS.INVALID_OBJECT_TYPE}`);
        if(objects.filter(o => o['key'] && o['value']).length < objects.length) throw new TypeError(`\x1b[31m${ERRORS.INVALID_OBJECT}`);
        for(var i = 0; i < objects.length; i++){
            const o = objects[i];
            const _filter = this._array.filter(s => s.key === o.key);
            if(_filter.length > 0){
                _filter[0].value = o.value;
            } else {
                this._array.push(o);
            }
        }
        this.size = this._array.length;
        return this;
    }
    import(id){
        return new Promise(async (resolve) => {
            if(typeof id !== 'number' && typeof id !== 'string') throw new TypeError(`\x1b[31m${ERRORS.INVALID_ID}`);
            const filter = ids.filter(r => r.id === String(id));
            if(filter.length === 0) return resolve(false);
            var file;
            try{
                var content = await fs.readFile(path.join(__dirname, filter[0].src));
                file = JSON.parse(content);
            } catch {
                file = [];
            }
            this._array = file;
            this.size = file.length;
            this._id = id;
            resolve(this);
        });
    }
    save(id, concat){
        return new Promise(async (resolve, reject) => {
            if(typeof id !== 'number' && typeof id !== 'string') reject(`\x1b[31m${ERRORS.INVALID_ID}`);
            if(String(id).toLowerCase().startsWith(INFO.ILLEGAL_SAVE_ID.toLowerCase())) reject(`\x1b[31m${ERRORS.ILLEGAL_SAVE_ID.split('[ILLEGAL_SAVE_ID]').join(INFO.ILLEGAL_SAVE_ID)}`);
            const filter = ids.filter(r => r.id === String(id));
            if(concat === true && filter.length > 0){
                try{
                    await fs.access(path.join(__dirname, `./src/saves/${String(id)}.json`), constants.F_OK);
                } catch(err){
                    try{
                        await fs.writeFile(path.join(__dirname, `./src/saves/${String(id)}.json`), JSON.stringify(this._array));
                    } catch(err_write){
                        reject(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_SAVE_NOT_FOUND.split('[SAVE_ID]').join(String(id)));
                        return;
                    }
                }
                var _buffer;
                try{
                    _buffer = await fs.readFile(path.join(__dirname, `./src/saves/${id}.json`));
                } catch (err){
                    var _random = random(10000, 0);
                    while(ids.filter(s => s.id === `${INFO.ILLEGAL_SAVE_ID}_${_random}`).length > 0){
                        _random = random(10000, 0);
                    }
                    try{
                        await fs.writeFile(path.join(__dirname, `./src/saves/${INFO.ILLEGAL_SAVE_ID}_${_random}.json`), JSON.stringify(this._array));
                        console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_READ_FILE.split('[SAVE_ID]').join(id).split('[TEMP_SAVE_ID]').join(`${INFO.ILLEGAL_SAVE_ID}_${_random}`));
                        resolve(this);
                    } catch(err_write){
                        reject(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_CREATE_AUTOSAVE.split('[SAVE_ID]').join(String(id)));
                        return;
                    }
                }
                var buffer;
                try{
                    buffer = JSON.parse(_buffer);
                } catch {
                    buffer = [];
                }
                this._array = this._array.concat(buffer);
                this.size = this._array.length;
                try{
                    await fs.writeFile(path.join(__dirname, `./src/saves/${String(id)}.json`), JSON.stringify(this._array));
                } catch(err_write){
                    reject(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_WRITE_SAVE.split("[SAVE_ID]").join(id));
                    return;
                }
            } else {
                try{
                    await fs.writeFile(path.join(__dirname, `./src/saves/${String(id)}.json`), JSON.stringify(this._array));
                } catch(err){
                    reject(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_WRITE_SAVE.split("[SAVE_ID]").join(String(id)));
                    return;
                }
                if(filter.length === 0){
                    ids.push({id: String(id), src: `./src/saves/${String(id)}.json`});
                    try{
                        await fs.writeFile(path.join(__dirname, `./src/ids.json`), JSON.stringify(ids));
                    } catch(err_write){
                        reject(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UPDATE_IDS);
                        return;
                    }
                }
                
            }
            this._id = id;
            resolve(this);
        });
    }
    concat(valuesaver){
        if(!(valuesaver instanceof ValueSaver)) throw new TypeError(`\x1b[31m${ERRORS.INVALID_VALUESAVER_TYPE}`);
        if(!valuesaver.__ValueSaverInfo) throw new TypeError(`\x1b[31m${ERRORS.INVALID_VALUESAVER_TYPE}`);
        if(valuesaver.__ValueSaverInfo.VERSION !== INFO.VERSION) console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.DIFFERENT_VALUESAVER_VERSION);
        var concatReadableArray = valuesaver.toReadableArray();
        const concatFilter = concatReadableArray.filter(i => typeof this.get(i.key) !== 'undefined');
        if(concatFilter.length > 0){
            for(var i = 0; i < concatFilter.length; i++){
                var key = concatFilter[i].key;
                this.delete(key);
            }
        }
        var newReadableArray = this._array.concat(concatReadableArray);
        const newSave = new ValueSaver(newReadableArray);
        return newSave;
    }
    concatArray(valuesaver){
        if(!(valuesaver instanceof ValueSaver)) throw new TypeError(`\x1b[31m${ERRORS.INVALID_VALUESAVER_TYPE}`);
        if(!valuesaver.__ValueSaverInfo) throw new TypeError(`\x1b[31m${ERRORS.INVALID_VALUESAVER_TYPE}`);
        if(valuesaver.__ValueSaverInfo.VERSION !== INFO.VERSION) console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.DIFFERENT_VALUESAVER_VERSION);
        var concatReadableArray = valuesaver.toReadableArray();
        const concatFilter = concatReadableArray.filter(i => typeof this.get(i.key) !== 'undefined');
        if(concatFilter.length > 0){
            for(var i = 0; i < concatFilter.length; i++){
                var key = concatFilter[i].key;
                this.delete(key);
            }
        }
        var newReadableArray = this._array.concat(concatReadableArray);
        return newReadableArray;
    }
    reduce(func, initialValue){
        var val = initialValue;
        for(var i = 0; i < this._array.length; i++){
            var obj = this._array[i];
            val = func(val, {...obj}, i, this._array);
        }
        return val;
    }
    map(callback){
        return this._array.map(callback);
    }
    removeSave(){
        const id = this._id;
        const valuesaver = this;
        return new Promise(async (resolve, reject) => {
            if(!id) throw new TypeError(`\x1b[31m${ERRORS.INVALID_SAVE_ID}`);
            const filter = ids.filter(r => r.id === id);
            if(filter.length === 0) return false;
            try{
                await fs.unlink(path.join(__dirname, filter[0].src));
            } catch(err_unlink){
                reject(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UNLINK.split("[SAVE_ID]").join(file.split(".json").join("")));
                return;
            }
            const index = ids.indexOf(filter[0]);
            ids.splice(index, 1);
            try{
                await fs.writeFile(path.join(__dirname, `./src/ids.json`), JSON.stringify(ids));
            } catch(err_write){
                reject(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UPDATE_IDS);
                return;
            }
            resolve(valuesaver);
        });
    }
    removeAllSaves(){
        return new Promise(async (resolve, reject) => {
            var files;
            try{
                files = await fs.readdir(path.join(__dirname, `./src/saves/`));
            } catch (err){
                reject(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_READ_FOLDER);
                return;
            }
            files.forEach(async file => {
                if(file === INFO.NON_FUNCTIONATING_SAVE) return;
                try{
                    await fs.unlink(path.join(__dirname, `./src/saves/`, file));
                } catch {
                    console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UNLINK.split("[SAVE_ID]").join(file.split(".json").join("")));
                }
            });
            try{
                await fs.writeFile(path.join(__dirname, `./src/ids.json`), JSON.stringify([]));
            } catch(err_write){
                reject(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UPDATE_IDS);
                return;
            }
            ids = [];
            resolve(this);
        });
    }
    hasValue(value){
        const filter = this._array.filter(r => r.value === value);
        if(filter.length > 0) return true;
        else return false;
    }
    fromArray(arr){
        if(!Array.isArray(arr)) throw new TypeError(`\x1b[31m${ERRORS.INVALID_ARRAY_TYPE}`);
        var readableArray = [];
        for(var i = 0; i < arr.length; i++){
            const obj = arr[i];
            if(typeof obj !== 'object') continue;
            for(const key in obj){
                readableArray.push({key: key, value: obj[key]});
            }
        }
        const newValueSaver = new ValueSaver(readableArray);
        return newValueSaver;
    }
    fromMap(map){
        if(!(map instanceof Map)) throw new TypeError(`\x1b[31m${ERRORS.INVALID_MAP_TYPE}`);
        var mapArray = Array.from([...map.entries()]);
        const valueSaverFromMap = new ValueSaver();
        for(var i = 0; i < mapArray.length; i++){
            var arrayRow = mapArray[i];
            if(['string', 'number'].indexOf(typeof arrayRow[0]) < 0){
                continue;
            }
            var key = arrayRow[0];
            arrayRow.shift();
            if(arrayRow.length === 1) valueSaverFromMap.set(key, arrayRow[0]);
            else if(arrayRow.length > 1) {
                valueSaverFromMap.set(key, [...arrayRow]);
            } else {
                continue;
            }
        }
        return valueSaverFromMap;
    }
    clear(){
        this._array = [];
        this.size = 0;
        return this;
    }
    getAllSaves(){
        const saves = [];
        for(var i = 0; i < ids.length; i++){
            const save = ids[i];
            saves.push(save.id);
        }
        return saves;
    }
}

Object.defineProperty(ValueSaver, 'ValueSaver', {
    value: ValueSaver,
    writable: false
});
  
module.exports = ValueSaver;
