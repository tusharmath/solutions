/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const h = require('snabbdom/h')
const R = require('ramda')

const CarOptions = R.map(type => h('option', type))

module.exports = CarOptions