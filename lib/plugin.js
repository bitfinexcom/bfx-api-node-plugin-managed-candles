'use strict'

const { definePlugin } = require('bfx-api-node-core')
const onCandleData = require('./data/candles')

const Plugin = definePlugin('bfx.managed-candles', {}, (h = {}, args = {}) => ({
  type: 'ws2',
  data: {
    candles: onCandleData(h, args)
  }
}))

module.exports = Plugin
