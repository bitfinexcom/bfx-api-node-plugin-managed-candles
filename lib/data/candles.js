'use strict'

const { Candle } = require('bfx-api-node-models')
const { TIME_FRAME_WIDTHS } = require('bfx-hf-util')
const _isFinite = require('lodash/isFinite')
const _isArray = require('lodash/isArray')
const _reverse = require('lodash/reverse')
const dataKey = require('../util/candle_data_key')

/**
 * @param {Object} args
 * @param {Object} args.state
 * @param {Object} args.data
 * @return {Object} nextState - contains updated books
 */
module.exports = (h = {}, args = {}) => ({ state = {}, data = {} } = {}) => {
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

  // Fill in empty candles
  if (incomingCandles.length > 1) {
    for (let i = 0; i < incomingCandles.length - 1; i += 1) {
      const candle = incomingCandles[i]
      const nextCandle = incomingCandles[i + 1]
      const candlesToFill = ((nextCandle[0] - candle[0]) / width) - 1

      if (candlesToFill > 0) {
        const fillerCandles = Array.apply(null, Array(candlesToFill)).map((c, i) => {
          return [
            candle[0] + (width * (i + 1)), // mts
            candle[2], // open
            candle[2], // close
            candle[2], // high
            candle[2], // low
            0 // vol
          ]
        })

        incomingCandles.splice(i + 1, 0, ...fillerCandles)
      }
    }
  }

  const finalCandles = _reverse(incomingCandles) // note final reverse
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
    original: nextCandles.map(c => c.serialize()),
  })

  return {
    ...state,
    candles: {
      ...candles,
      [key]: nextCandles,
    }
  }
}
