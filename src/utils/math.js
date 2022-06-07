// 正则表达式
export const toThousands = (num) => {
    if (!num) {
      return num
    }
    return num.toString().replace(/\d+/, function (n) {
      return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    });
  };
  