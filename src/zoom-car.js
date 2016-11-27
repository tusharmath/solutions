/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const R = require('ramda')
const O = require('observable-air')
const view = require('./view')
const t = require('./tasks')
const {Dispatcher} = require('./dispatcher')

const targetValue = R.path(['target', 'value'])
const setDistance = R.compose(R.assoc('distance'), Number, targetValue)
const setType = R.compose(R.assoc('type'), targetValue)
const setStartDate = R.compose(R.assoc('startDate'), Date.parse, targetValue)
const setEndDate = R.compose(R.assoc('endDate'), Date.parse, targetValue)

function main () {
  const dispatcher = Dispatcher.of('@@root')
  const root$ = dispatcher.select('@@root')
  const data = t.fetch('/car-data.json')
  const reducer$ = O.merge(
    O.map(R.assoc('cars'), data.response$),
    O.map(R.assoc('selected'), Dispatcher.select('select', root$)),
    O.map(setDistance, Dispatcher.select('distance', root$)),
    O.map(setType, Dispatcher.select('type', root$)),
    O.map(setStartDate, Dispatcher.select('startDate', root$)),
    O.map(setEndDate, Dispatcher.select('endDate', root$))
  )
  const model$ = O.scan((a, b) => a(b), {
    distance: 50,
    type: 'any',
    startDate: 1475295987000,
    endDate: 1477715187000
  }, reducer$)

  return O.merge(
    O.of(data),
    O.map(model => t.patch(view(dispatcher, model)), model$)
  )
}

O.forEach(x => x.run(), main())

