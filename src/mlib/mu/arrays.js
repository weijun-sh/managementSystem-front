export function number2List(number) {
    let list = [];
    for (let i = 0; i < number; i++) {
        list.push(i + '')
    }
    return list;
}

export default {
    number2List,
}