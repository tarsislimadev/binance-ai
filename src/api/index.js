const EventEmitter = require('events')
const { BinanceAPI } = require('./apis/binance.js')

const ee = new EventEmitter()
const binance_api = new BinanceAPI()

ee.on('exit', () => process.exit(0))

ee.on('klines', () => binance_api.klines())

process.stdin.on('data', (data) => ee.emit(...data.toString().split(/\s+/ig).filter((p) => p)))
