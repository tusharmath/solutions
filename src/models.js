/**
 * Created by tusharmathur on 7/7/15.
 */
"use strict";

var Mongorito = require('mongorito');
var Model = Mongorito.Model;

Mongorito.connect('localhost/address');

class Contact extends Model {

}

module.exports = {Contact};