export const toThousands = (num) => {
    if (num == null || num === '') {
      return num
    }
    return num.toString().replace(/\d+/, function (n) {
      return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    });
  };
