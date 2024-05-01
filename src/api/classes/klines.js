// 

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

module.exports = { Klines }
