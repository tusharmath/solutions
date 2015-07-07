/**
 * Created by tusharmathur on 7/8/15.
 */
"use strict";
var co = require('co'),
    watch = require('./AsyncWatcher');

var ContactSearchController = co.wrap(function * (rest, $scope) {
    for (let i of watch($scope, 'selected')) {
        let selectedId = (yield i).newValue;
        if (selectedId) {
            $scope.contact = yield rest.one('contacts', selectedId).get();
        }
    }
});

ContactSearchController.$inject = ['Restangular', '$scope'];
module.exports = ContactSearchController;