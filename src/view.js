/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const h = require('snabbdom/h')
const R = require('ramda')

const MaterialCheckBox = (enabled) => h('div.material-checkbox', [
  h('i.material-icons', [enabled ? 'check_box' : 'check_box_outline_blank'])
])

const numFormat = Intl.NumberFormat('en-IN')
const Cars = (dispatcher, model) =>
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
        '₹ ' + numFormat.format(car.pricePerHour * 24)
      ]),
      h('div.distance', [
        `${car.distanceKMS} Kms`
      ])
    ])
  ]), model.cars)

const UniqCarTypes = R.compose(R.uniq, R.pluck('type'))
const CarType = R.map(type => h('option', type))

const FilterHeader = (cars) => {

  return h('div.filter-header', [
    h('h3', ['Available Cars']),
    h('div.filters', [
      h('select', CarType(UniqCarTypes(cars)))
    ])
  ])
}

module.exports = (dispatcher, model) => {
  return h('div', [
    h('div.nav-main', ['Zoom Car Rentals']),
    h('div.content', [
      FilterHeader(model.cars),
      h('div.car-list', Cars(dispatcher, model))
    ])
  ])
}