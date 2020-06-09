'use strict'

/**
 * @private
 *
 * @param {object} channel - channel
 * @param {string} channel.key - candle channel key
 * @returns {string} key
 */
const candleDataKey = (channel) => {
  const { key } = channel
  return key
}

module.exports = candleDataKey
