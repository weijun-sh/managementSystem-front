function formatParams(obj) {
    let params = ''
    for (let key in obj) {
        let value = obj[key];
        params += `${key}=${value}&`
    }
    params = params.replace(/(&)$/, '');
    return params
}

function paramsToObj(params) {
    params = params
        .replace(/=/g, ':')
        .replace(/&/g, ',')
        .replace(/([A-Za-z0-9]+)/g, function (item) {
            return `"${item}"`
        })
    params = "{" + params + "}";
    params = JSON.parse(params);
    return params;
}

export function changeHash(obj) {
    let group = window.location.hash.split('?');
    let pathname = group[0]


    let params = ''
    if (group.length === 1) {
        params = formatParams(obj)
        params = `?${params}`
    } else {

        let group1 = paramsToObj(group[1])

        params = {...group1, ...obj}
        params = formatParams(params)
        params = `?${params}`
    }

    let hash = `${pathname}${params}`;
    window.location.hash = hash
}
