const { EventEmitter } = require('events')

class API extends EventEmitter {
  debug = false

  _response(key, value = '') {
    if (this.debug) console.log('API:response', key, value)
    this.emit(key, value)
  }

  _error(e = new Error('Undefined error.')) {
    if (this.debug) console.log('API:error', e)
    this.emit('error', e.message)
  }
}

module.exports = { API }
