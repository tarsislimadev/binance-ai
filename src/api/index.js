const config = require('./config.js')

let running = false

const fixDecimal = (num = 0) => +num.toString().replace(/(.)99999.+/, (_, n) => n + 1).replace(/000000.+/, 0)

const run = (runned = 0) =>
  fetch(config.url.klines('BNBBRL', '1s', 60)).then(res => res.json())
    .then((json) => Array.from(json).map(([Kline_Open_Time, Open_Price, High_Price, Low_Price, Close_Price, Volume, Kline_Close_Time, Quote, Trades, Taker_Buy_Base, Taker_Buy_Quote]) => ({ Kline_Open_Time: +Kline_Open_Time, Open_Price: +Open_Price, High_Price: +High_Price, Low_Price: +Low_Price, Close_Price: +Close_Price, Volume: +Volume, Kline_Close_Time: +Kline_Close_Time, Quote: +Quote, Trades: +Trades, Taker_Buy_Base: +Taker_Buy_Base, Taker_Buy_Quote: +Taker_Buy_Quote, })))
    .then((res) => Array.from(res).map((kline, ix) => ({ ...kline, Diff: fixDecimal(ix === 0 ? 0 : kline.Close_Price - res[ix - 1].Close_Price) })))
    .then((res) => Array.from(res).map(({ Diff }) => Diff))
    .then((res) => console.log(runned, res))
    .catch(err => console.error(err))
    .finally(() => running ? setTimeout(run, 1000, ++runned) : null)

const exit = () => process.exit(0)

const stop = () => { running = false }

const start = () => { running = true; run() }

const exec = (instr = '') => {
  switch (instr.substring(0, 4)) {
    case 'star': return start()
    case 'stop': return stop()
    case 'run1': return run()
    case 'exit': return exit()
  }
}

process.stdin.on('data', (data) => exec(data.toString()))
