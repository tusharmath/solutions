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
const filterCars = model => {
  const matches = R.allPass([
    car => car.distanceKMS < model.distance,
    car => model.type === 'any' || car.type === model.type,
    car => Number(car.availability.startDate) <= model.startDate,
    car => Number(car.availability.endDate) >= model.endDate
  ])
  return R.filter(matches, model.cars)
}
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
  ]), filterCars(model))

const UniqCarTypes = R.compose(R.uniq, R.pluck('type'))
const CarType = R.map(type => h('option', type))

const FilterHeader = (dispatcher, model) => h('div.filter-header', [
  h('div.filter-row', [
    h('div.filter', [
      h('div.small', 'START DATE'),
      h('input', {props: {type: 'date', valueAsDate: new Date(1475295987000)}, on: {change: dispatcher.of('startDate').listen}})
    ]),
    h('div.filter', [
      h('div.small', 'END DATE'),
      h('input', {props: {type: 'date', valueAsDate: new Date(1477887987000)}, on: {change: dispatcher.of('endDate').listen}})
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
      h('select', {on: {change: dispatcher.of('type').listen}}, CarType(R.prepend('any', UniqCarTypes(model.cars))))
    ])
  ])
])


function Confirmation (dispatcher, car) {
  const props = {on: {click: dispatcher.of('select').listen.bind(null, undefined)}};
  return h('div.confirmation', [
    h('div.dialog', [
      h('h4', [`Confirm ${car.brand} ${car.model} booking?`]),
      h('p', ['Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.']),
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
      FilterHeader(dispatcher, model),
      h('div.car-list', Cars(dispatcher, model))
    ]),
    model.selected ? Confirmation(dispatcher, model.selected) : '  '
  ])
}