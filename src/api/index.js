const crypto = require('crypto')

const { EventManager } = require('./event.manager.js')

const state = { running: false, messages: {}, }

const ee = new EventManager()

const ws = new WebSocket('wss://ws-api.binance.com:443/ws-api/v3')

ee.addEventListener('ws:send', ({ data: { id, method, params } }) => ws.send(JSON.stringify({ id, method, params })))

ee.addEventListener('ws:send', ({ data: { id, method, params } }) => { state.messages[id] = { request: { id, method, params }, response: null } })

const wsSend = (method, params = {}, id = uuid()) => ee.dispatch('ws:send', { id, method, params })

ws.addEventListener('open', (data) => ee.dispatch('binance:open', data))

ws.addEventListener('message', ({ data }) => ee.dispatch('binance:message', JSON.parse(data)))

ws.addEventListener('error', (data) => ee.dispatch('binance:error', data))

ws.addEventListener('close', (data) => ee.dispatch('binance:close', data))

ee.addEventListener('binance:open', () => console.log('binance:open', Date.now()))

ee.addEventListener('binance:message', ({ value: data }) => console.log('message', { data }))

ee.addEventListener('exit', () => process.exit())

ee.addEventListener('run', () => { if (state.running) wsSend('klines', require('./params.js')) })

ee.addEventListener('start', () => { state.running = true; ee.dispatch('run') })

ee.addEventListener('stop', () => { state.running = false })

ee.addEventListener('binance:open', () => ee.dispatch('start'))

ee.addEventListener('binance:close', () => ee.dispatch('stop'))

process.stdin.on('data', (data) => ee.dispatch(...data.toString().split(/\s+/ig).filter((p) => p)))
