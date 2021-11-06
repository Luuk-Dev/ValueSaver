const fs = require('fs');
const path = require('path');
var ids = require('./src/ids.json');
const {ERRORS, WARNINGS, INFO} = require('./src/constants.json');
const wait = require('./src/wait.js');
const random = require('./src/random');

if(!fs.existsSync(path.join(__dirname, `./src`))) throw new Error(`Please re-install ValueSaver. The source folder doesn't exists which is required in order to functionate.`);
else if(!fs.existsSync(path.join(__dirname, `./src/saves`))){
    fs.mkdir(path.join(__dirname, `./src/saves`), (err) => {
        if(err) return console.warn(`\x1b[33m%s\x1b[0m`, err);
    });
} else {
    (async () => {
        for(var i = 0; i < ids.length; i++){
            await wait(100);
            fs.access(path.join(__dirname, ids[i].src), fs.constants.F_OK, (err) => {
                if(err){
                    fs.writeFile(path.join(__dirname, ids[i].src), (err_write) => {
                        return console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_SAVE_NOT_FOUND.split('[SAVE_ID]').join(ids[i].id));
                    });
                }
            });
        }
    })();
}

class ValueSaver {
    constructor(array){
        if(typeof array === 'object'){
            if(array.filter(r => r.key).length < array.length || array.filter(r => r.value).length < array.length) throw new TypeError(`\x1b[31m${ERRORS.INVALID_ARRAY}`);
            this._array = array;
            this.size = array.length;
        } else {
            this._array = [];
            this.size = 0;
        }
        this._id = null;
        this.__ValueSaverInfo = INFO;
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
        } else return null;
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
        if(set_filter.length > 0){
            const key = set_filter[0].key;
            const value = set_filter[0].value;
            const obj = {};
            obj[key] = value;
            return obj;
        } else return null;
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
        if(typeof id !== 'number' && typeof id !== 'string') throw new TypeError(`\x1b[31m${ERRORS.INVALID_ID}`);
        const filter = ids.filter(r => r.id === id);
        if(filter.length === 0) return false;
        const file = JSON.parse(fs.readFileSync(path.join(__dirname, filter[0].src)));
        this._array = file;
        this.size = file.length;
        this._id = id;
        return this;
    }
    save(id, concat){
        if(typeof id !== 'number' && typeof id !== 'string') throw new TypeError(`\x1b[31m${ERRORS.INVALID_ID}`);
        if(String(id).toLowerCase().startsWith(INFO.ILLEGAL_SAVE_ID.toLowerCase())) throw new TypeError(`\x1b[31m${ERRORS.ILLEGAL_SAVE_ID.split('[ILLEGAL_SAVE_ID]').join(INFO.ILLEGAL_SAVE_ID)}`);
        const filter = ids.filter(r => r.id === id);
        if(concat === true && filter.length > 0){
            fs.access(path.join(__dirname, `./src/saves/${id}.json`), fs.constants.F_OK, (err) => {
                if(err){
                    fs.writeFile(path.join(__dirname, `./src/saves/${id}.json`), JSON.stringify(this._array), (err_write) => {
                        console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_SAVE_NOT_FOUND.split('[SAVE_ID]').join(id));
                        return this;
                    });
                } else {
                    fs.readFile(path.join(__dirname, `./src/saves/${id}.json`), (err, _buffer) => {
                        if(err){
                            var _random = random(10000, 0);
                            while(ids.filter(s => s.id === `${INFO.ILLEGAL_SAVE_ID}_${_random}`).length > 0){
                                _random = random(10000, 0);
                            }
                            fs.writeFile(path.join(__dirname, `./src/saves/${INFO.ILLEGAL_SAVE_ID}_${_random}.json`), JSON.stringify(this._array), (err_write) => {
                                if(err_write){
                                    console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_CREATE_AUTOSAVE.split('[SAVE_ID]').join(id));
                                    return this;
                                } else {
                                    console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_READ_FILE.split('[SAVE_ID]').join(id).split('[TEMP_SAVE_ID]').join(`${INFO.ILLEGAL_SAVE_ID}_${_random}`));
                                    return this;
                                }
                            });
                        } else {
                            const buffer = JSON.parse(_buffer);
                            this._array = this._array.concat(buffer);
                            this.size = this._array.length;
                            fs.writeFile(path.join(__dirname, `./src/saves/${id}.json`), JSON.stringify(this._array), (err_write) => {
                                if(err_write){
                                    console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_WRITE_SAVE.split("[SAVE_ID]").join(id));
                                    return this;
                                }
                            });
                        }
                    });
                }
            });
        } else {
            fs.writeFile(path.join(__dirname, `./src/saves/${id}.json`), JSON.stringify(this._array), (err) => {
                if(err){
                    console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_WRITE_SAVE.split("[SAVE_ID]").join(id));
                    return this;
                }
                if(filter.length === 0){
                    ids.push({id: id, src: `./src/saves/${id}.json`});
                    fs.writeFile(path.join(__dirname, `./src/ids.json`), JSON.stringify(ids), (err_write) => {
                        if(err_write){
                            console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UPDATE_IDS);
                            return this;
                        }
                    });
                }
            });
        }
        this._id = id;
        return this;
    }
    concat(valuesaver){
        if(!valuesaver) throw new TypeError(`\x1b[31m${ERRORS.INVALID_VALUESAVER_TYPE}`);
        if(!valuesaver.__ValueSaverInfo) throw new TypeError(`\x1b[31m${ERRORS.INVALID_VALUESAVER_TYPE}`);
        if(valuesaver.__ValueSaverInfo.VERSION !== INFO.VERSION) console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.DIFFERENT_VALUESAVER_VERSION);
        this._array = this._array.concat(valuesaver.toReadableArray());
        this.size = this._array.length;
        return this;
    }
    removeSave(){
        const id = this._id;
        const valuesaver = this;
        return new Promise((resolve) => {
            if(!id) throw new TypeError(`\x1b[31m${ERRORS.INVALID_SAVE_ID}`);
            const filter = ids.filter(r => r.id === id);
            if(filter.length === 0) return false;
            fs.unlink(path.join(__dirname, filter[0].src), (err_unlink) => {
                if(err_unlink){
                    console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UNLINK.split("[SAVE_ID]").join(file.split(".json").join("")));
                    resolve(valuesaver);
                }
                const index = ids.indexOf(filter[0]);
                ids.splice(index, 1);
                fs.writeFile(path.join(__dirname, `./src/ids.json`), JSON.stringify(ids), (err_write) => {
                    if(err_write){
                        console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UPDATE_IDS);
                        resolve(valuesaver);
                        fs.writeFile(path.join(__dirname, `./src/saves/${id}`), JSON.stringify([]));
                    }
                });
                resolve(valuesaver);
            });
        });
    }
    removeAllSaves(){
        fs.readdir(path.join(__dirname, `./src/saves/`), (err, files) => {
            if(err){
                console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_READ_FOLDER);
                return this;
            }
            files.forEach(file => {
                if(file === INFO.NON_FUNCTIONATING_SAVE) return;
                fs.unlink(path.join(__dirname, `./src/saves/`, file), (err_unlink) => {
                    if(err_unlink) console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UNLINK.split("[SAVE_ID]").join(file.split(".json").join("")));
                });
            });
            fs.writeFile(path.join(__dirname, `./src/ids.json`), JSON.stringify([]), (err_write) => {
                if(err_write){
                    console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UPDATE_IDS);
                    return this;
                }
            });
            ids = [];
            return this;
        });
    }
    hasValue(value){
        const filter = this._array.filter(r => r.value === value);
        if(filter.length > 0) return true;
        else return false;
    }
    clear(){
        this._array = [];
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
  
module.exports = {ValueSaver};
