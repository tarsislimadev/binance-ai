// 

const json = (url) => fetch(url).then(res => res.json())

const klines = (symbol, interval = '1s', limit = 1000) => json(`https://api4.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)

module.exports = { klines }
