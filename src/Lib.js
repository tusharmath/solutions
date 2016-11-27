/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const R = require('ramda')
const L = {}

L.filterCars = model => {
  const predicates = [
    R.compose(R.gte(model.distance), R.prop('distanceKMS')),
    R.anyPass([
      R.always(model.type === 'any'),
      R.compose(R.equals(model.type), R.prop('type'))
    ]),
    R.compose(R.gte(model.startDate), Number, R.path(['availability', 'startDate'])),
    R.compose(R.lte(model.endDate), Number, R.path(['availability', 'endDate']))
  ]
  return R.filter(R.allPass(predicates), model.cars)
}

L.uniqCarTypes = R.compose(R.uniq, R.pluck('type'))

L.numFormat = Intl.NumberFormat('en-IN')

module.exports = L