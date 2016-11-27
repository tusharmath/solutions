/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const R = require('ramda')
const O = require('observable-air')
const view = require('./view')
const t = require('./tasks')
const {Dispatcher} = require('./dispatcher')


function main () {
  const dispatcher = Dispatcher.of('@@root')
  const root$ = dispatcher.select('@@root')
  const data = t.fetch('/car-data.json')
  const reducer$ = O.merge(
    O.map(R.assoc('cars'), data.response$),
    O.map(R.assoc('selected'), Dispatcher.select('select', root$)),
    O.map(R.compose(R.assoc('distance'), Number, R.path(['target', 'value'])), Dispatcher.select('distance', root$))
  )
  const model$ = O.scan((a, b) => a(b), {}, reducer$)

  O.forEach(x => console.log(x), model$)

  return O.merge(
    O.of(data),
    O.map(model => t.patch(view(dispatcher, model)), model$)
  )
}

O.forEach(x => x.run(), main())

