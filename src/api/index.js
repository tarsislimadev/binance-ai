const EventEmitter = require('events')

const ee = new EventEmitter()

const { Klines } = require('./classes')

ee.on('run', (symbol = 'BNBBRL', limit = 60) => fetch(config.url.klines(symbol, '1s', limit)).then(res => res.json())
  .then((json) => Array.from(json).map(([Kline_Open_Time, Open_Price, High_Price, Low_Price, Close_Price, Volume, Kline_Close_Time, Quote, Trades, Taker_Buy_Base, Taker_Buy_Quote]) => ({ Kline_Open_Time: +Kline_Open_Time, Open_Price: +Open_Price, High_Price: +High_Price, Low_Price: +Low_Price, Close_Price: +Close_Price, Volume: +Volume, Kline_Close_Time: +Kline_Close_Time, Quote: +Quote, Trades: +Trades, Taker_Buy_Base: +Taker_Buy_Base, Taker_Buy_Quote: +Taker_Buy_Quote, })))
  .then((klines) => new Klines(klines))
  .then((klines) => console.log('klines', klines.getDiff()))
)

ee.on('start', (...data) => console.log('start', ...data))

ee.on('exit', () => process.exit(0))

process.stdin.on('data', (data) => ee.emit(...data.toString().split(/\s+/ig)))
