
export function ellipsisCenter(str) {
    if (!str) { return '' }
    return str.substr(0, 6) + "..." + str.substr(str.length - 4)
}
