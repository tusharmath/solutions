/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const h = require('snabbdom/h')
const DummyText = require('./DummyText')

const Confirmation = (dispatcher, car) => {
  const props = {on: {click: dispatcher.of('select').listen.bind(null, undefined)}};
  return h('div.confirmation', [
    h('div.overlay'),
    h('div.dialog', [
      h('h4', [`Confirm ${car.brand} ${car.model} booking?`]),
      DummyText(),
      h('div.footer', [
        h('div.btn.btn-link.warning', props, ['CONFIRM']),
        h('div.btn.btn-link.primary', props, ['CANCEL'])
      ]),
    ])
  ])
}

module.exports = Confirmation