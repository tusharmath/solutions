/**
 * Created by tusharmathur on 7/7/15.
 */
"use strict";
var angular = require('angular'),
    co = require('co');
var _ = window._ = require('lodash');
var rest = require('restangular');
var app = angular.module('pay-pal', ['restangular'])
    .config(['RestangularProvider', function (restP) {
        restP.setBaseUrl('/api/v1');
    }])
    .controller('ContactDetailsController', require('./ContactDetailsController'))
    .controller('ContactCreateController', require('./ContactCreateController'))
    .controller('ContactSearchController', require('./ContactSearchController'))
    .controller('AddressBookController', require('./AddressBookController'));

var _createDirective = _.partial(createDirective, app);

_createDirective('contactSearch');
_createDirective('contactDetails');
_createDirective('contactCreate');
function createDirective(app, name) {
    var templateUrl = `/templates/${_.kebabCase(name)}`,
        controller = `${_.capitalize(name)}Controller`,
        restrict = 'E';
    app.directive(_.camelCase(name), function () {
        return {templateUrl, restrict, controller};
    });
}
