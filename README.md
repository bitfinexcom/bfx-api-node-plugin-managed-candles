# Bitfinex Managed Candle Dataset Plugin for the Node.JS API

[![Build Status](https://travis-ci.org/bitfinexcom/bfx-api-node-plugin-managed-candles.svg?branch=master)](https://travis-ci.org/bitfinexcom/bfx-api-node-plugin-managed-candles)

This plugin maintains a full sorted candle set on its internal state, and emits it with every candle update with the event name `data:managed:candles`. The internal dataset is populated when receiving data from candle channels.

Note that the manager proxies the event as `managed:candles`. If subscribing on a socket instance (`wsState.ev.on(...)`) use the internal event name, otherwise use the manager name with `manager.onWS(...)`.

### Features

* Maintains an up-to-date array of all received candles
* Emits a new 'managed:candles' event with the full dataset on each update

### Installation

```bash
npm i --save bfx-api-node-plugin-managed-candles
```

### Quickstart

```js
const { Manager } = require('bfx-api-node-core')
const ManagedCandlesPlugin = require('bfx-api-node-plugin-managed-candles')

const mgr = new Manager({
  plugins: [ManagedCandlesPlugin()]
})

// set up a connection, event listeners, etc

mgr.onWS('managed:candles', {}, (candles) => {
  debug(JSON.stringify(candles.toJS(), null, 2))
})
```

### Docs

For an executable example, [see `examples/usage.js`](/examples/usage.js)

### Example
```js
const debug = require('debug')('bfx:api:plugins:managed-candles:example')
const { Manager, subscribe } = require('bfx-api-node-core')
const ManagedCandlesPlugin = require('../')

const SYMBOL = 'tBTCUSD'
const mgr = new Manager({
  transform: true,
  plugins: [ManagedCandlesPlugin()]
})

mgr.onWS('open', {}, () => debug('connection open'))

// Receive updated dataset
mgr.onWS('managed:candles', {}, (candles) => {
  debug('updated dataset for %s contains %d candles', SYMBOL, candles.length)
  debug('latest candle follows')
  debug(JSON.stringify(candles[0].toJS(), null, 2))
})

const wsState = mgr.openWS()

subscribe(wsState, 'candles', { key: `trade:1m:${SYMBOL}` })
```

### Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
