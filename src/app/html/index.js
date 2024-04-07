import { HTML } from '@brtmvdl/frontend'

export class Page extends HTML {
  state = {
    symbol: 'USDTBRL',
    interval: '1m',
    limit: 100,
  }

  onCreate() {
    super.onCreate()
    this.append(this.getHTML())
    this.getKlines()
  }

  getHTML() {
    const html = new HTML()
    return html
  }

  getKlines() {
    const url = `https://api4.binance.com/api/v3/klines?symbol=${this.state.symbol}&interval=${this.state.interval}&limit=${this.state.limit}`

    fetch(url).then(res => res.json())
      .then((json) => Array.from(json).map(([Kline_Open_Time, Open_Price, High_Price, Low_Price, Close_Price, Volume, Kline_Close_Time, Quote, Trades, Taker_Buy_Base, Taker_Buy_Quote]) => ({ Kline_Open_Time: +Kline_Open_Time, Open_Price: +Open_Price, High_Price: +High_Price, Low_Price: +Low_Price, Close_Price: +Close_Price, Volume: +Volume, Kline_Close_Time: +Kline_Close_Time, Quote: +Quote, Trades: +Trades, Taker_Buy_Base: +Taker_Buy_Base, Taker_Buy_Quote: +Taker_Buy_Quote, })))
      .then((arr) => console.log({ arr }))
      .catch(err => console.error(err))
  }
}
