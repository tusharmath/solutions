/**
 * Created by tusharmathur on 7/1/15.
 */
(function () {
    "use strict";

    var $ = document.querySelector.bind(document),
        $newTransaction = $('#new-transaction'),
        TRANSACTION_FIELDS = ['amount', 'payees', 'payer', 'description'],
        transactions = [],
        _map = function (list, cb, ctx) {
            var results = [];
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                results.push(cb.call(ctx || null, obj, i));
            }
            return results;
        },
        _inputData = function (el, keys) {
            return _map(keys, function (key) {
                var elements = el.elements;
                return {
                    key: key,
                    value: elements[key] ? elements[key].value : null
                }
            });
        },
        _toObject = function (arr) {
            var obj = {};
            _map(arr, function (i) {
                obj[i.key] = i.value;
            });
            return obj
        },
        _identity = function (x) {
            return x;
        },
        _toArray = function (item) {
            return _map(item, _identity);
        },
        _head = function (list) {
            return list [0];
        },
        _body = function (arr) {
            return arr.slice(1);
        },

        _flow = function () {
            var funcList = _toArray(arguments).reverse(),
                funcHead = _head(funcList),
                funcBody = _body(funcList);

            return function () {
                var temp = funcHead.apply(null, arguments);
                _map(funcBody, function (func) {
                    temp = func(temp);
                });
                return temp;
            };
        },
        _tokenize = function (str) {
            if (!str || str.length <= 0) {
                return [];
            }
            return _map(str.split(','), function (str) {
                return str.trim();
            });
        },
        _transaction = function (transactionRaw) {
            return {
                payees: _tokenize(transactionRaw.payees),
                amount: parseInt(transactionRaw.amount, 10),
                payer: transactionRaw.payer.trim()
            }
        },
        getTransactionFromForm = _flow(_transaction, _toObject, _inputData);

    $('#create').addEventListener('click', function () {

        var transaction = getTransactionFromForm($newTransaction, TRANSACTION_FIELDS);
        transactions.push(transaction);
    });

})();