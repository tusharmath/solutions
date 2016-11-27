/**
 * Created by tushar on 27/11/16.
 */

'use strict'
const h = require('snabbdom/h')

const MaterialCheckBox = (enabled) => h('div.material-checkbox', [
  h('i.material-icons', [enabled ? 'check_box' : 'check_box_outline_blank'])
])

module.exports = MaterialCheckBox