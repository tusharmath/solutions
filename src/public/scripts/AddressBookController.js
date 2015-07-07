/**
 * Created by tusharmathur on 7/8/15.
 */
"use strict";
var co = require('co'),
    _ = require('lodash');

var AddressBookController = co.wrap(function * (rest, $scope) {
    var contactsR = rest.all('contacts');
    $scope.searchText = '';
    $scope.contacts = yield contactsR.getList();
    $scope.charGroups = _.keys(_.groupBy($scope.contacts, function (contact) {
        return contact.first_name[0].toLowerCase();
    })).sort();
    $scope.create = false;
    $scope.edit = false;

    $scope.setSelected = function (id) {
        $scope.selected = id;
    };
    $scope.setSearchText = function (str) {
        $scope.searchText = str;
    };

    $scope.setSelected(_.first($scope.contacts)._id);
    $scope.save = co.wrap(function * () {
        yield contactsR.post($scope.newContact);
        $scope.contacts = yield rest.all('contacts').getList();
        $scope.create = $scope.edit = false;
    });

    $scope.update = co.wrap(function * () {
        yield $scope.contact.save();
        $scope.contacts = yield rest.all('contacts').getList();
        $scope.create = $scope.edit = false;
    });

});

AddressBookController.$inject = ['Restangular', '$scope'];
module.exports = AddressBookController;