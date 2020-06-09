<a name="bfx-api-node-plugin-managed-candles"></a>

## bfx-api-node-plugin-managed-candles() ⇒ <code>bfx-api-node-core.Plugin</code>
This module is a plugin for
[bfx-api-node-core](https://github.com/bitfinexcom/bfx-api-node-core) that maintains a full sorted candle set
on its internal state, and emits it with every candle update with the event
name `data:managed:candles`. The internal dataset is populated when
receiving data from candle channels.

Note that the `Manager` proxies the event as `managed:candles`. If
subscribing on a socket instance (`wsState.ev.on(...)`) use the internal
event name, otherwise use the manager name with `manager.onWS(...)`.

**Kind**: global function  
**Returns**: <code>bfx-api-node-core.Plugin</code> - pluginState  
**License**: MIT  
**Example**  
```js
const debug = require('debug')('bfx:api:plugins:managed-candles:example')
const { Manager, subscribe } = require('bfx-api-node-core')
const ManagedCandlesPlugin = require('bfx-api-node-plugin-managed-candles')

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
