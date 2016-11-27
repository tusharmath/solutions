/**
 * Created by tushar on 27/11/16.
 */

'use strict'

const O = require('observable-air')

class Action {
  constructor (type, value) {
    this.type = type
    this.value = value
  }
}

class Dispatcher {
  constructor (fac, subject = O.subject()) {
    this.fac = fac
    this.subject = subject
    this.listen = this.listen.bind(this)
  }

  listen (value) {
    this.subject.next(this.fac(value))
  }

  get event$ () {
    return this.subject
  }

  of (type) {
    return new Dispatcher(
      (value) => this.fac(new Action(type, value)),
      this.subject
    )
  }

  select (type) {
    return Dispatcher.select(type, this.event$)
  }

  static of (type) {
    return new Dispatcher(v => new Action(type, v))
  }

  static select (type, source) {
    return O.map(x => x.value, O.filter(x => x.type === type, source))
  }
}

module.exports = {Dispatcher}