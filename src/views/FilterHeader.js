/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const h = require('snabbdom/h')
const R = require('ramda')
const L = require('../Lib')
const CarOptions = require('./CarOptions')


const FilterHeader = (dispatcher, model) => h('div.filter-header', [
  h('div.filter-row', [
    h('div.filter', [
      h('div.small', 'START DATE'),
      h('input', {
        props: {type: 'date', valueAsDate: new Date(model.startDate)},
        on: {change: dispatcher.of('startDate').listen}
      })
    ]),
    h('div.filter', [
      h('div.small', 'END DATE'),
      h('input', {
        props: {type: 'date', valueAsDate: new Date(model.endDate)},
        on: {change: dispatcher.of('endDate').listen}
      })
    ])
  ]),
  h('div.filter-row', [
    h('div.filter', [
      h('div.small', `DISTANCE ${model.distance} Kms`),
      h('input', {
        props: {type: 'range', min: 1, max: 50, step: 1, value: 50},
        on: {change: dispatcher.of('distance').listen}
      })
    ]),
    h('div.filter', [
      h('div.small', 'TYPE'),
      h('select', {on: {change: dispatcher.of('type').listen}},
        CarOptions(R.prepend('any', L.uniqCarTypes(model.cars)))
      )
    ])
  ])
])

module.exports = FilterHeader