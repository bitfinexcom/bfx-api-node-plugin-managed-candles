# Bitfinex Node API Managed Candle Dataset Plugin

[![Build Status](https://travis-ci.org/bitfinexcom/bfx-api-node-plugin-managed-candles.svg?branch=master)](https://travis-ci.org/bitfinexcom/bfx-api-node-plugin-managed-candles)

This plugin maintains a full sorted candle set on its internal state, and emits it with every candle update with the event name `data:managed:candles`. The internal dataset is populated when receiving data from candle channels.

Note that the manager proxies the event as `managed:candles`. If subscribing on a socket instance (`wsState.ev.on(...)`) use the internal event name, otherwise use the manager name with `manager.onWS(...)`.

### Example
```js
'use strict'

process.env.DEBUG = '*'

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
