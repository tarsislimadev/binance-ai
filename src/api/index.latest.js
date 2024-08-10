const EventEmitter = require('events')
const { BinanceAPI } = require('./apis/binance.js')
const { Database } = require('@brtmvdl/database')

const ee = new EventEmitter()
const binance_api = new BinanceAPI()
const db = new Database({ type: 'fs', config: '/data' })

const calcDiffPrice = (a, b) => 0 // FIXME

const calcDiffPercent = (a, b) => 0 // FIXME

binance_api.on('klines', (arr) => {
  Array.from(arr)
    .map(([KlineOpenTime, OpenPrice, HighPrice, LowPrice, ClosePrice, Volume, KlineCloseTime, QuoteAssetVolume, NumberofTrades, TakerBuyBaseAssetVolume, TakerBuyQuoteAssetVolume]) => ({ KlineOpenTime: +KlineOpenTime, OpenPrice: +OpenPrice, HighPrice: +HighPrice, LowPrice: +LowPrice, ClosePrice: +ClosePrice, Volume: +Volume, KlineCloseTime: +KlineCloseTime, QuoteAssetVolume: +QuoteAssetVolume, NumberofTrades: +NumberofTrades, TakerBuyBaseAssetVolume: +TakerBuyBaseAssetVolume, TakerBuyQuoteAssetVolume: +TakerBuyQuoteAssetVolume, }))
    .map((kline) => [kline, db.in('klines').new().writeMany(kline)]).map((kline) => console.log('saved kline', kline))
})

ee.on('exit', () => process.exit(0))

ee.on('binance.klines', (symbol = 'BNBBRL') => binance_api.klines(symbol))

ee.on('db.klines', () => ee.emit('db.klines.response', db.in('klines').list()))

ee.on('db.klines.response', (klines) => console.log('db.klines.response', Array.from(klines).map((kline) => kline.toJSON())))

ee.on('db.klines.response', (klines) => ee.emit('db.klines.updated', Array.from(klines).map(((kline, ix) => kline.writeMany({ DiffPrice: calcDiffPrice(), DiffPercent: calcDiffPercent(), Previous: klines[ix - 1]?.id })))))

ee.on('db.klines.updated', (klines) => console.log('db.klines.updated', klines))

process.stdin.on('data', (data) => ee.emit(...data.toString().split(/\s+/ig).filter((p) => p)))
