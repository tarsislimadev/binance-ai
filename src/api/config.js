// 

module.exports.url = {
  klines:  (symbol, interval, limit,) => `https://api4.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
}
