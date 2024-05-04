const { createHmac } = require('node:crypto')
const EventEmitter = require('events')
const { fixDecimal } = require('../utils/functions.js')

const { secretKey, apiKey } = require('../config.js')

class BinanceAPI extends EventEmitter {
  state = {
    diff: [],
    symbol: 'BNBBRL',
    interval: '1s',
    limit: 1000,
  }

  constructor(symbol, interval = '1s', limit = 1000) {
    super()
    this.state.symbol = symbol
    this.state.interval = interval
    this.state.limit = limit
  }

  api(method = 'GET', pathname = '', { query = {}, headers = new Headers(), body = null } = {}) {
    const searchParams = (new URLSearchParams(query)).toString()
    const url = (new URL(`https://api4.binance.com/api/v3${pathname}?` + searchParams)).toString()
    return fetch(url, { method, headers, body }).then((res) => res.json())
  }

  getKlines(symbol = this.state.symbol, interval = this.state.interval, limit = this.state.limit) {
    this.api('GET', '/klines', { query: { symbol, interval, limit } })
      .then((json) => Array.from(json).map(([Kline_Open_Time, Open_Price, High_Price, Low_Price, Close_Price, Volume, Kline_Close_Time, Quote, Trades, Taker_Buy_Base, Taker_Buy_Quote]) => ({ Kline_Open_Time: +Kline_Open_Time, Open_Price: +Open_Price, High_Price: +High_Price, Low_Price: +Low_Price, Close_Price: +Close_Price, Volume: +Volume, Kline_Close_Time: +Kline_Close_Time, Quote: +Quote, Trades: +Trades, Taker_Buy_Base: +Taker_Buy_Base, Taker_Buy_Quote: +Taker_Buy_Quote, })))
      .then((klines) => Array.from(klines).map((kline, ix) => ({ ...kline, Diff: fixDecimal(ix === 0 ? 0 : kline.Close_Price - klines[ix - 1].Close_Price) })))
      .then((klines) => this.state.diff = Array.from(klines).map(({ Diff }) => Diff))
      .then(() => this.update())
  }

  update() {
    this.emit('updated', this.state.diff)
  }

  getUrlSearchByParams(params = {}) {
    return Object.keys(params).sort((a, b) => a.toString().localeCompare(a)).map((p) => `${p}=${params[p]}`).join('&')
  }

  createSignature(params = {}) {
    return createHmac('sha256', secretKey).update(this.getUrlSearchByParams(params)).digest('hex')
  }

  createParams(params = {}, timestamp = Date.now()) {
    params = { ...params, timestamp, apiKey }
    return { signature: this.createSignature(params), ...params }
  }

  orderTest(side = '', symbol = this.state.symbol, type = 'MARKET', quantity = 1, timestamp = Date.now()) {
    const query = this.createParams({ symbol, side, type, quantity }, timestamp)
    const headers = new Headers()
    headers.set('X-MBX-APIKEY', apiKey)
    return this.api('POST', '/order/test', { headers, query }).then((json) => console.log('buy', timestamp, query, json))
  }

  buy(symbol = this.state.symbol, type = 'MARKET', quantity = 1, timestamp = Date.now()) {
    return this.orderTest('BUY', symbol, type, quantity, timestamp)
  }

  sell(symbol = this.state.symbol, type = 'MARKET', quantity = 1, timestamp = Date.now()) {
    return this.orderTest('SELL', symbol, type, quantity, timestamp)
  }
}

module.exports = { BinanceAPI }
