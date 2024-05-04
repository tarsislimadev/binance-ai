const EventEmitter = require('events')

const ee = new EventEmitter()

const { BinanceAPI } = require('./classes')

let running = []

const actions = []

let binance = new BinanceAPI('BNBBRL', '1s')

binance.on('updated', (...data) => console.log('updated', ...data))

ee.on('klines', (...data) => binance.getKlines(...data))

ee.on('start', (...data) => running.push(setInterval(() => ee.emit('klines', ...data), 1000)))

ee.on('stop', (id = running.pop()) => clearInterval(id))

ee.on('exit', () => process.exit(0))

ee.on('running', () => console.log(...running))

ee.on('config', (symbol, interval = '1s', limit = 1000) => binance = new BinanceAPI(symbol, interval, limit))

ee.on('buy', (...data) => binance.buy(...data))

ee.on('sell', (...data) => binance.sell(...data))

ee.on('api', (...data) => binance.api(...data).then((json) => console.log(json)).catch((err) => console.error(err)))

process.stdin.on('data', (data) => ee.emit(...data.toString().split(/\s+/ig).filter((p) => p)))
