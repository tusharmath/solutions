/**
 * Created by tusharmathur on 7/7/15.
 */
"use strict";
var angular = require('angular'),
    co = require('co');
var _ = window._ = require('lodash');
var rest = require('restangular');
angular.module('pay-pal', ['restangular'])
    .config(['RestangularProvider', function (restP) {
        restP.setBaseUrl('/api/v1');
    }])
    .controller('ContactSearchController', require('./ContactSearchController'))
    .directive('contactSearch', function () {
        return {
            templateUrl: '/templates/contact-search',
            restrict: 'E',
            controller: 'ContactSearchController'
        }
    });
