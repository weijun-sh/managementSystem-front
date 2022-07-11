export function dateFormatter(timestamp) {
    if (!timestamp) {
        return '-'
    }
    if ((timestamp + "").length === 10) {
        timestamp = timestamp * 1000
    }
    let date = new Date(timestamp)
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
}

export function transferSecond(second_time) {

    if (!second_time) {
        return second_time
    }
    var time = parseInt(second_time) + "s";
    if (parseInt(second_time) > 60) {

        var second = parseInt(second_time) % 60;
        var min = parseInt(second_time / 60);
        time = min + "m " + second + "s";

        if (min > 60) {
            min = parseInt(second_time / 60) % 60;
            var hour = parseInt(parseInt(second_time / 60) / 60);
            time = hour + "h " + min + "m " + second + "s";

            if (hour > 24) {
                hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                time = day + "days " + hour + "h " + min + "m " + second + "s";
            }
        }

    }
    return time;
}
