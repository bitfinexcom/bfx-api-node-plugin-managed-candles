'use strict'

const { Candle } = require('bfx-api-node-models')
const { TIME_FRAME_WIDTHS } = require('bfx-hf-util')
const { padCandles } = require('bfx-api-node-util')
const _isFinite = require('lodash/isFinite')
const _isArray = require('lodash/isArray')
const _reverse = require('lodash/reverse')
const dataKey = require('../util/candle_data_key')

/**
 * @throws {Error} if a candle with an unknown timeframe width is received
 * @memberof module:bfx-api-node-plugin-managed-candles
 * @private
 *
 * @param {module:bfx-api-node-core.PluginHelpers} h - helpers
 * @param {object} args - plugin arguments
 * @returns {module:bfx-api-node-core.PluginEventHandler} func
 */
const onCandleData = (h = {}, args = {}) => ({ state = {}, data = {} } = {}) => {
  const { chanFilter = {} } = data
  const { candles = {}, ev } = state
  const key = dataKey(chanFilter)
  let { original = [] } = data

  // Ensure array of candles
  if (!_isArray(original[0])) {
    original = [original]
  }

  const incomingCandles = _reverse([...original]) // note we reverse again below
  const tf = chanFilter.key.split(':')[1]
  const width = TIME_FRAME_WIDTHS[tf]

  if (!_isFinite(width)) {
    throw new Error('received invalid candle time frame %s', tf)
  }

  const finalCandles = incomingCandles.length > 1
    ? padCandles(incomingCandles, width)
    : [...incomingCandles]

  const nextCandles = candles[key]
    ? candles[key]
    : finalCandles.map(candle => new Candle(candle))

  if (candles[key]) {
    candles[key].unshift(new Candle(finalCandles[0]))
  }

  ev.emit('data:managed:candles', {
    ...data,
    msg: nextCandles,
    requested: nextCandles,
    original: nextCandles.map(c => c.serialize())
  })

  return {
    ...state,
    candles: {
      ...candles,
      [key]: nextCandles
    }
  }
}

module.exports = onCandleData
