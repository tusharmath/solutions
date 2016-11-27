/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const R = require('ramda')
const O = require('observable-air')
const view = require('./view')
const t = require('./tasks')
const {Dispatcher} = require('./dispatcher')

const fetchJson = R.compose(
  O.join,
  O.map(R.compose(O.fromPromise, R.always, R.invoker(0, 'json'))),
  R.prop('response$')
)


function main () {
  const dispatcher = Dispatcher.of('@@root')
  const root$ = dispatcher.select('@@root')

  const data = t.fetch('/car-data.json')
  const reducer$ = O.merge(
    O.map(R.assoc('cars'), fetchJson(data)),
    O.map(R.assoc('selected'), Dispatcher.select('select', root$))
  )
  const model$ = O.scan((a, b) => a(b), {}, reducer$)
  const view$ = O.map(model => t.patch(view(dispatcher, model)), model$)
  return O.merge(
    O.of(data),
    view$
  )
}

O.forEach(x => x.run(), main())

