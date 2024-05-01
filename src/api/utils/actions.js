// 

const isBuy = (prices = []) => 'it is not a buy'

const isSell = (prices = []) => 'it is not a sell'

const sum = (prices = []) => Array.from(prices).reduce((s, n) => +s + +n, 0)

module.exports = { isBuy, isSell, sum }
