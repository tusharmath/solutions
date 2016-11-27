/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const h = require('snabbdom/h')
const Cars = require('./Cars')
const CarOptions = require('./CarOptions')
const FilterHeader = require('./FilterHeader')
const Confirmation = require('./Confimation')

module.exports = (dispatcher, model) => {

  return h('div', [
    h('div.nav-main', ['Zoom Car Rentals']),
    h('div.content', [
      FilterHeader(dispatcher, model),
      h('div.car-list', Cars(dispatcher, model))
    ]),
    model.selected ? Confirmation(dispatcher, model.selected) : ''
  ])
}