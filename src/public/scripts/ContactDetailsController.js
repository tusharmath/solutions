/**
 * Created by tusharmathur on 7/8/15.
 */
/**
 * Created by tusharmathur on 7/8/15.
 */
"use strict";
var co = require('co'),
    AsyncWatcher = require('./AsyncWatcher');

var ContactSearchController = co.wrap(function * (rest, $scope) {
    for (let i of AsyncWatcher($scope, 'selected')) {
        let selectedId = (yield i).newValue;
        if (selectedId) {
            $scope.contact = yield rest.one('contacts', selectedId).get();
        }
    }
});

ContactSearchController.$inject = ['Restangular', '$scope'];
module.exports = ContactSearchController;