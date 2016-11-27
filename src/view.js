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
      h('select', CarType(R.prepend('any', UniqCarTypes(cars))))
    ])
  ])
}

function Confirmation (dispatcher, car) {
  const props = {on: {click: dispatcher.of('select').listen.bind(null, undefined)}};
  return h('div.confirmation', [
    h('div.dialog', [
      h('h4', [`Confirm ${car.brand} ${car.model} booking?`]),
      h('p', ['I agree to terms and condition, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.']),
      h('div.footer', [
        h('div.btn.btn-link.warning', props, ['AGREE']),
        h('div.btn.btn-link.primary', props, ['DISAGREE'])
      ]),
    ])
  ])
}
module.exports = (dispatcher, model) => {

  return h('div', [
    h('div.nav-main', ['Zoom Car Rentals']),
    h('div.content', [
      FilterHeader(model.cars),
      h('div.car-list', Cars(dispatcher, model))
    ]),
    model.selected ? Confirmation(dispatcher, model.selected) : '  '
  ])
}