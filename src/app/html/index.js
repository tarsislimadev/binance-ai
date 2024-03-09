import { HTML } from '@brtmvdl/frontend'

export class Page extends HTML {
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
    fetch('https://api4.binance.com/api/v3/klines?symbol=USDTBRL&interval=1m')
      .then(res => res.json())
      .then(table => console.table(table))
      .catch(err => console.error(err))
  }
}
