/**
 * Created by tusharmathur on 7/8/15.
 */
"use strict";
var co = require('co');
var ContactSearchController = co.wrap(function * (rest, $scope) {
    $scope.contacts = yield rest.all('contacts').getList();
});

ContactSearchController.$inject = ['Restangular', '$scope'];
module.exports = ContactSearchController;