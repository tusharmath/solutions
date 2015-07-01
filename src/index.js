/**
 * Created by tusharmathur on 7/1/15.
 */
(function () {
    "use strict";

    var $ = document.querySelector.bind(document),
        _map = function (list, cb, ctx) {
            var results = [];
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                results.push(cb.call(ctx || null, obj));
            }
            return results;
        },
        _inputData = function (el, keys) {
            return _map(keys, function (key) {
                return {
                    key: key,
                    value: el.elements[key] ? el.elements[key].value : null
                }
            });
        },
        _toObject = function (arr) {
            var obj = {};
            _map(arr, function (i) {
                obj[i.key] = i.value;
            });
            return obj
        };

    var data = _inputData($('#new-transaction'), ['amount', 'payees', 'payer', 'description']);
    console.log(_toObject(data));

})();