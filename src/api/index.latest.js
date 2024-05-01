const config = require('./config.js')

let running = false

const fixDecimal = (num = 0) => +num.toString().replace(/(.)99999.+/, (_, n) => n + 1).replace(/000000.+/, 0)

class Klines {
  klines = []

  constructor(klines = []) {
    this.klines = klines
  }

  calcDiff() {
    this.klines = Array.from(this.klines).map((kline, ix) => ({ ...kline, Diff: fixDecimal(ix === 0 ? 0 : kline.Close_Price - res[ix - 1].Close_Price) }))
  }

  getDiff() {
    const { klines } = this

    return Array.from(klines)
      .map((kline, ix) => ({ ...kline, Diff: fixDecimal(ix === 0 ? 0 : kline.Close_Price - klines[ix - 1].Close_Price) }))
      .map(({ Diff }) => Diff)
  }

  toString() {
    return JSON.stringify(this.klines, null, 4)
  }
}

const run = (symbol = 'BNBBRL', limit = 60) =>
  fetch(config.url.klines(symbol, '1s', limit)).then(res => res.json())
    .then((json) => Array.from(json).map(([Kline_Open_Time, Open_Price, High_Price, Low_Price, Close_Price, Volume, Kline_Close_Time, Quote, Trades, Taker_Buy_Base, Taker_Buy_Quote]) => ({ Kline_Open_Time: +Kline_Open_Time, Open_Price: +Open_Price, High_Price: +High_Price, Low_Price: +Low_Price, Close_Price: +Close_Price, Volume: +Volume, Kline_Close_Time: +Kline_Close_Time, Quote: +Quote, Trades: +Trades, Taker_Buy_Base: +Taker_Buy_Base, Taker_Buy_Quote: +Taker_Buy_Quote, })))
    .then((klines) => new Klines(klines))
    .then((klines) => console.log('klines', klines.getDiff()))
    .finally(() => running ? setTimeout(() => run(symbol, limit), 1000) : null)

const exit = () => process.exit(0)

const stop = () => { running = false }

const start = (symbol = 'BNBBRL', limit = 60) => { running = true; run(symbol, limit) }

const startParams = (instr = '') => { const [symbol = 'BNBBRL', limit = 60] = instr.split(' ').slice(1); return [symbol, limit] }

const exec = (instr = '') => {
  console.log('exec', { instr })

  switch (instr.substring(0, 4)) {
    case 'star': return start(...startParams(instr))
    case 'stop': return stop()
    case 'run1': return run()
    case 'exit': return exit()
  }
}

process.stdin.on('data', (data) => exec(data.toString()))

exec(process.argv.slice(2).join(' '))
