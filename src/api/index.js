const EventEmitter = require('events')

const { BinanceAPI } = require('./classes')

const { Database } = require('@brtmvdl/database')

const db = new Database({ type: 'fs', config: '/data' })

db.addListener('writeMany', (...data) => console.log('writeMany', ...data))

let running = []

let binance = new BinanceAPI('BNBBRL', '1s', 100)

// binance.on()

binance.on('updated', (...data) => console.log('updated', ...data))

binance.on('orderTest', (data) => {
  db.in('orderTest').new().writeMany(data)
  //
  console.log('orderTest', data)
})

const ee = new EventEmitter()

ee.on('run', (...data) => binance.getKlines(...data))

ee.on('start', (...data) => running.push(setInterval(() => ee.emit('run', ...data), 1000)))

ee.on('stop', (id = running.pop()) => clearInterval(id))

ee.on('exit', () => process.exit(0))

ee.on('running', () => console.log(...running))

ee.on('config', (symbol, interval = '1s', limit = 1000) => binance = new BinanceAPI(symbol, interval, limit))

ee.on('buy', (...data) => binance.buy(...data))

ee.on('sell', (...data) => binance.sell(...data))

ee.on('api', (...data) => binance.api(...data).then((json) => console.log(json)).catch((err) => console.error(err)))

process.stdin.on('data', (data) => ee.emit(...data.toString().split(/\s+/ig).filter((p) => p)))
