const logStyles = [
    'color:white',
    'background: gray',
    'font-size:12px',
    'border:1px solid gray',
    'border-radius:2px',
    'padding:2px',].join(';');

const successStyles = [
    'color:white',
    'background:green',
    'font-size:12px',
    'border:1px solid green',
    'border-radius:2px',
    'padding:2px',].join(';');

const warnStyles = [
    'color: #fff',
    'background: #e37530',
    'font-size:12px',
    'border:1px solid #e37530',
    'border-radius:2px',
    'padding:2px',].join(';');

const errorStyles = [
    'color:white',
    'background: #c33',
    'font-size:12px',
    'border:1px solid #c00',
    'border-radius:2px',
    'padding:2px',].join(';');

const infoStyles = [
    'color:white',
    'background: blue',
    'font-size:12px',
    'border:1px solid blue',
    'border-radius:2px',
    'padding:2px',].join(';');

export function log(key, value) {
    if(process.env.NODE_ENV === 'production'){
        return;
    }
    if(arguments.length === 1){
        console.log(`%c ${key} ==>`, logStyles);
        return;
    }
    console.log(`%c ${key} ==>`, logStyles, value);
}
export function success(key, value) {
    if(process.env.NODE_ENV === 'production'){
        return;
    }
    if(arguments.length === 1){
        console.log(`%c ${key} ==>`, successStyles);
        return;
    }
    console.log(`%c ${key} ==>`, successStyles, value);
}

export function warm(key, value) {
    if(process.env.NODE_ENV === 'production'){
        return;
    }
    if(arguments.length === 1){
        console.log(`%c ${key} ==>`, warnStyles);
        return;
    }
    console.log(`%c ${key} ==>`, warnStyles, value);
}

export function info(key, value) {
    if(process.env.NODE_ENV === 'production'){
        return;
    }
    if(arguments.length === 1){
        console.log(`%c ${key} ==>`, infoStyles);
        return;
    }
    console.log(`%c ${key} ==>`, infoStyles, value);
}


export function error(key, value) {
    if(process.env.NODE_ENV === 'production'){
        return;
    }
    if(arguments.length === 1){
        console.log(`%c ${key} ==>`, errorStyles);
        return;
    }
    console.log(`%c ${key} ==>`, errorStyles, value);
}

function groupOutput(type){
    let style = '';
    switch (type){
        case 'error':
            style = errorStyles;
            break;
        case 'success':
            style = successStyles;
            break;
        case 'warm':
            style = warnStyles;
            break;
        default:
            break;

    }
    return function (title, key, value, key1, value1, key2, value2){
        console.group(`%c ${title}`, style);
        window.log(key, value);
        if(key1){
            window.log(key1, value1);
        }
        if(key2){
            window.log(key2, value2);
        }
        console.groupEnd();
    }

}

export function groupError() {
    groupOutput("error")(...arguments)
}

export function groupSuccess() {
    groupOutput("success")(...arguments)
}
export function groupWarm( ) {
    groupOutput("warm")(...arguments)
}


window.log = log;
window.success = success;
window.warm = warm;
window.error = error;
window.info = info;
window.groupError = groupError;
window.groupSuccess = groupSuccess;
window.groupWarm = groupWarm;

export default {
    log,
    warm,
    error,
    success,
    info
}
