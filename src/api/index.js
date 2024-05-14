const EventEmitter = require('events')

const ee = new EventEmitter()

ee.on('exit', () => process.exit(0))

process.stdin.on('data', (data) => ee.emit(...data.toString().split(/\s+/ig).filter((p) => p)))
