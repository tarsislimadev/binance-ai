const EventEmitter = require('events')
const { BinanceAPI } = require('./apis/binance.js')
const { Database } = require('@brtmvdl/database')

const ee = new EventEmitter()
const binance_api = new BinanceAPI()
const db = new Database({ type: 'fs', config: '/data' })

binance_api.on('klines', (arr) => {
  Array.from(arr)
    .map(([KlineOpenTime, OpenPrice, HighPrice, LowPrice, ClosePrice, Volume, KlineCloseTime, QuoteAssetVolume, NumberofTrades, TakerBuyBaseAssetVolume, TakerBuyQuoteAssetVolume]) => ({ KlineOpenTime, OpenPrice, HighPrice, LowPrice, ClosePrice, Volume, KlineCloseTime, QuoteAssetVolume, NumberofTrades, TakerBuyBaseAssetVolume, TakerBuyQuoteAssetVolume }))
    .map((kline) => [kline, db.in('klines').new().writeMany(kline)]).map((kline) => console.log('saved kline', kline))
})

ee.on('exit', () => process.exit(0))

ee.on('klines', (symbol = 'BNBBRL', interval = '1s', limit = 100) => binance_api.klines(symbol, interval, limit))

process.stdin.on('data', (data) => ee.emit(...data.toString().split(/\s+/ig).filter((p) => p)))
