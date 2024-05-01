const EventEmitter = require('events')

const { fixDecimal } = require('../utils/functions.js')

class BinanceAPI extends EventEmitter {
  state = {
    diff: [],
    symbol: '',
    interval: '1s',
    limit: 1000,
  }

  constructor(symbol, interval = '1s', limit = 1000) {
    super()
    this.state.symbol = symbol
    this.state.interval = interval
    this.state.limit = limit
  }

  update() {
    const { symbol, interval, limit } = this.state
    fetch(`https://api4.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`).then((res) => res.json())
      .then((json) => Array.from(json).map(([Kline_Open_Time, Open_Price, High_Price, Low_Price, Close_Price, Volume, Kline_Close_Time, Quote, Trades, Taker_Buy_Base, Taker_Buy_Quote]) => ({ Kline_Open_Time: +Kline_Open_Time, Open_Price: +Open_Price, High_Price: +High_Price, Low_Price: +Low_Price, Close_Price: +Close_Price, Volume: +Volume, Kline_Close_Time: +Kline_Close_Time, Quote: +Quote, Trades: +Trades, Taker_Buy_Base: +Taker_Buy_Base, Taker_Buy_Quote: +Taker_Buy_Quote, })))
      .then((klines) => Array.from(klines).map((kline, ix) => ({ ...kline, Diff: fixDecimal(ix === 0 ? 0 : kline.Close_Price - klines[ix - 1].Close_Price) })))
      .then((klines) => this.state.diff = Array.from(klines).map(({ Diff }) => Diff))
      .then(() => this.emit('updated', this.state.diff))
      .catch((err) => console.error(err))
  }
}

module.exports = { BinanceAPI }
