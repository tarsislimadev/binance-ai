const { API } = require('./api.js')

class BinanceAPI extends API {
  // debug = true

  _request(method = 'GET', pathname = '/', { query = {} } = {}) {
    return fetch(`https://api4.binance.com${pathname}?${(new URLSearchParams(query)).toString()}`, { method }).then((res) => res.json())
  }

  klines(symbol = 'BNBBRL', interval = '1s', limit = 10) {
    this._request('GET', '/api/v3/klines', { query: { symbol, interval, limit } })
      .then((json) => this._response('klines', json))
      .catch((err) => this._error(err))
  }
}

module.exports = { BinanceAPI }
