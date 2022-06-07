
export function ellipsisCenter(str) {
    if (!str) { return '' }
    return str.substr(0, 5) + "..." + str.substr(str.length - 4)
}
