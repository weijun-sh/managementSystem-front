

export function storageSet(key, value){
    if(Object.prototype.toString.call(value) === '[object Object]'){
        value = JSON.stringify(value)
    }

    window.localStorage.setItem(key, value)
}

export function storageGet(key){
    let value = window.localStorage.getItem(key)
    try {
        value = JSON.parse(key)
    }catch (e){

    }
    return value;
}

export function storageRemove(key){
    localStorage.removeItem(key);
}



