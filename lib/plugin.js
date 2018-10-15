'use strict'

const { definePlugin } = require('bfx-api-node-core')
const onCandleData = require('./data/candles')

/**
 * Maintains a collection of candle data on the plugin state, and emits entire
 * candle sets for each incoming candle update.
 */
module.exports = definePlugin('bfx.managed-candles', {}, (h = {}, args = {}) => ({
  type: 'ws2',
  data: {
    candles: onCandleData(h, args)
  }
}))
