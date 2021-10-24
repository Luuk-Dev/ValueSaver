const fs = require('fs');
const path = require('path');
var ids = require('./src/ids.json');
const {ERRORS, WARNINGS, INFO} = require('./src/constants.json');

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
            const arr = key_validation.reduce((array, save) => {
                if(save['key'] && save['value']) array.push(save['key']);
                return array;
            }, []);
            return arr;
        } else return null;
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
        } else return undefined;
    }
    toArray(){
        const arr = this._array.reduce((array, item) => {
            if(item['key'] && item['value']){
                const key = item.key;
                const value = item.value;
                const obj = {};
                obj[key] = value;
                array.push(obj);
            }
            return array;
        }, []);
        return arr;
    }
    forEach(callback){
        if(typeof callback !== 'function') throw new TypeError(`\x1b[31m${ERRORS.INVALID_CALLBACK}`);
        this._array.forEach(v => {
            callback.call(this, v.value);
        });
        return this;
    }
    toReadableArray(){
        const arr = this._array.reduce((array, item) => {
            if(item['key'] && item['value']) array.push(item);
            return array;
        }, []);
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
        objects.forEach(object => {
            this._array.push(object);
        });
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
    save(id){
        if(typeof id !== 'number' && typeof id !== 'string') throw new TypeError(`\x1b[31m${ERRORS.INVALID_ID}`);
        const filter = ids.filter(r => r.id === id);
        if(filter.length > 0){
            const id_path = path.join(__dirname, filter[0].src);
            const arr = JSON.parse(fs.readFileSync(id_path));
            const newarr = this._array.reduce((array, save) => {
                array.push(save);
                return array;
            }, arr);
            fs.writeFile(path.join(__dirname, `./src/saves/${id}.json`), JSON.stringify(newarr), (err) => {
                if(err){
                    console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_WRITE_SAVE.split("[SAVE_ID]").join(id));
                    return this;
                }
            });
            this._id = id;
            return this;
        } else {
            fs.writeFile(path.join(__dirname, `./src/saves/${id}.json`), JSON.stringify(this._array), (err) => {
                if(err){
                    console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_WRITE_SAVE.split("[SAVE_ID]").join(id));
                    return this;
                }
                ids.push({id: id, src: `./src/saves/${id}.json`});
                fs.writeFile(path.join(__dirname, `./src/ids.json`), JSON.stringify(ids), (err_write) => {
                    if(err_write){
                        console.warn(`\x1b[33m%s\x1b[0m`, WARNINGS.ERROR_UPDATE_IDS);
                        return this;
                    }
                });
            });
            this._id = id;
            return this;
        }
    }
    removeSave(){
        const id = this._id;
        const valuesaver = this;
        return new Promise((resolve, reject) => {
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
        const saves = ids.reduce((array, save) => {
            array.push(save.id);
            return array;
        }, []);
        return saves;
    }
}
  
module.exports = {ValueSaver};
