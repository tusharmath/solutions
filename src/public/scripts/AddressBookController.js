/**
 * Created by tusharmathur on 7/8/15.
 */
"use strict";
var co = require('co'),
    _ = require('lodash');

var AddressBookController = co.wrap(function * (rest, $scope) {
    $scope.contacts = yield rest.all('contacts').getList();
    $scope.setSelected = function (id) {
        $scope.selected = id;
    };
    $scope.setSelected(_.first($scope.contacts)._id);
});

AddressBookController.$inject = ['Restangular', '$scope'];
module.exports = AddressBookController;