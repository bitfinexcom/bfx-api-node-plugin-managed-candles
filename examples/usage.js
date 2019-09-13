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
