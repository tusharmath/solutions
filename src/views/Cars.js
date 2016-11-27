/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const h = require('snabbdom/h')
const R = require('ramda')
const L = require('../Lib')
const MaterialCheckBox = require('./MaterialCheckBox')

module.exports = (dispatcher, model) =>
  R.map(car => h('div.car-card', {on: {click: dispatcher.of('select').listen.bind(null, car)}}, [
    MaterialCheckBox(model.selected === car),
    h('div.wide-col', [
      h('div.model', [`${car.brand} ${car.model}`]),
      h('div.details', [
        h('div.detail-item', [car.seater + ' Seater']),
        h('div.detail-item', [car.transmission + ' transmission']),
        h('div.detail-item', [car.airBags + ' Airbags'])
      ])
    ]),
    h('div', [
      h('div.price-per-hour', [
        '₹ ' + L.numFormat.format(car.pricePerHour * 24)
      ]),
      h('div.distance', [
        `${car.distanceKMS} Kms`
      ])
    ])
  ]), L.filterCars(model))