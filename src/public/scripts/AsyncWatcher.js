module.exports = function *($scope, key) {
    var defer = Promise.defer();
    $scope.$watch(key, function (newValue, oldValue) {
        defer.resolve({newValue, oldValue});
        defer = Promise.defer();
    });
    while (true) {
        yield defer.promise;
    }
};
