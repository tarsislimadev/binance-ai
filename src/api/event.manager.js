
class EventManager extends EventTarget {
  logs = false

  dispatch(key, value = {}) {
    if (this.logs) console.log('dispatch', { key, value })
    const ev = new Event(key)
    ev.value = value
    this.dispatchEvent(ev)
  }

  withLogs() { this.logs = true }
}

module.exports = {
  EventManager,
}
