// 

const fixDecimal = (num = 0) => +num.toString().replace(/(.)99999.+/, (_, n) => n + 1).replace(/000000.+/, 0)

module.exports = { fixDecimal }
