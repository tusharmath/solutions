/**
 * Created by tusharmathur on 7/1/15.
 */
(function () {
    "use strict";

    var $ = document.querySelector.bind(document),
        $newTransaction = $('#new-transaction'),
        $create = $('#create'),
        $transactionList = $('#transaction-list'),
        TRANSACTION_FIELDS = ['amount', 'payees', 'payer', 'description'],
        transactions = [],
        userBalance = {},
        _isArray = function (item) {
            return item instanceof  Array;
        },
        _keys = function (obj) {
            return Object.keys(obj);
        },
        _map = function (list, cb, ctx) {

            var results = [];

            if (_isArray(list)) {
                for (var i = 0; i < list.length; i++) {
                    results.push(cb.call(ctx || null, list[i], i, list));
                }
                return results;
            } else {
                return _map(_keys(list), function (key, i, keyList) {
                    return cb.call(ctx || null, list[key], key, list);
                });
            }
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

        _transactionToHtml = function (transaction, index, transactions) {
            return [
                '<div>',
                '<span>#' + index + '</span>',
                "<span class=\"lead\">" + transaction.payer + '</span>',
                '<small class="text-muted">paid</small>',
                '<span class="lead">' + transaction.amount + '</span>',
                '<small class="text-muted">for</small>',
                '<span class="lead">' + transaction.payees.join(', ') + '</span>',
                '</div>',
                '<hr/>'].join('\n');
        },
        _userBalanceToHtml = function (balance, index, balances) {
            return ['<div>',
                '<span class="lead" style="width: 50%; display: inline-block">' + balance.user + '</span>',
                '<span class="lead">' + balance.amount + '</span>',
                '</div>',
                '<hr/>'].join('\n');
        },
        _setInnerHtml = function (el, content) {
            el.innerHTML = content;
        },
        _calcPayerBalance = function (transaction, current) {
            current = current || 0;
            return current - transaction.amount;
        },
        _calcPayeeBalance = function (transaction, current) {
            current = current || 0;
            return current + transaction.amount / transaction.payees.length;
        },

        getTransactionFromForm = _flow(_transaction, _toObject, _inputData);

    $create.addEventListener('click', function () {
        var transaction = getTransactionFromForm($newTransaction, TRANSACTION_FIELDS);
        transactions.push(transaction);
        _setInnerHtml($transactionList, _map(transactions, _transactionToHtml));

        _map(transaction.payees, function (person, i) {
            userBalance[person] = _calcPayeeBalance(transaction, userBalance[person]);
        });
        userBalance[transaction.payer] = _calcPayerBalance(transaction, userBalance[transaction.payer]);
        console.log(userBalance);

    });

})();