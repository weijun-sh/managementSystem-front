const SwapStatus = {
  0: 'TxNotStable',
  1: 'TxVerifyFailed',
  3: 'TxWithWrongValue',
  5: 'TxNotSwapped',
  7: 'TxProcessed',
  8: 'MatchTxEmpty',
  9: 'MatchTxNotStable',
  10: 'MatchTxStable',
  12: 'TxWithBigValue',
  14: 'MatchTxFailed',
  15: 'SwapInBlacklist',
  16: 'ManualMakeFail',
  19: 'TxWithWrongPath',
  20: 'MissTokenConfig',
  21: 'NoUnderlyingToken',
  255: 'KeepStatus',
  256: 'Reswapping',
}

function renderStatus(status){
  return SwapStatus[status]
}

function transferSecond(second_time) {

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
let jsDateFormatter = function (timestamp) {
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

// 正则表达式
const toThousands = (num) => {
  if (!num) {
    return num
  }
  return num.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  });
};

function ellipsisCenter(str) {
  if (!str) { return '' }
  return str.substr(0, 5) + "..." + str.substr(str.length - 4)
}



export default {
  renderStatus,
  jsDateFormatter,
  ellipsisCenter,
  toThousands,
  transferSecond
}

