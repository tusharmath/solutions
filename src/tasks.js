/**
 * Created by tushar on 27/11/16.
 */

"use strict"

const snabbdom = require('snabbdom')
const O = require('observable-air')

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
])

let node = document.getElementById('container')

class Fetch {
  constructor (url) {
    this.url = url
    this.response$ = O.subject()
  }

  run () {
    fetch(this.url)
      .then(r => r.json())
      .then(json => {
        this.response$.next(json)
        this.response$.complete()
      })
      .catch(err => {
        this.response$.error(err)
        this.response$.complete()
      })
  }
}

class DomPatch {
  constructor (node) {
    this.__node = node
  }

  run () {
    node = patch(node, this.__node)
  }
}

exports.patch = (node) => new DomPatch(node)
exports.fetch = (url) => new Fetch(url)
