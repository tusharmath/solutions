/**
 * Created by tusharmathur on 7/8/15.
 */
/**
 * Created by tusharmathur on 7/8/15.
 */
"use strict";
var co = require('co');
var ContactSearchController = co.wrap(function * (rest, $scope) {
    $scope.contact = yield rest.one('contacts', $scope.id).get();
});

ContactSearchController.$inject = ['Restangular', '$scope'];
module.exports = ContactSearchController;