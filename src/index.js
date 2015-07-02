/**
 * Created by tusharmathur on 7/1/15.
 */
(function () {
    "use strict";

    var TRANSACTION_FIELDS = ['amount', 'payees', 'payer', 'description'],
        $ = document.querySelector.bind(document),
        $newTransaction = $('#new-transaction'),
        $create = $('#create'),
        $transactionList = $('#transaction-list'),
        $netBalanceList = $('#net-balance-list'),
        transactions = [],
        userBalance = {},
        _isArray = function (item) {
            return item instanceof  Array;
        },
        _keys = function (obj) {
            return Object.keys(obj);
        },
        _numberRound = function (number, decimal) {
            var power10 = Math.pow(10, decimal);
            return Math.round(number * power10) / power10;
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
        _keyValue = function (value, key) {
            return {value, key};
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

        _transactionToHtml = function (transaction, index) {
            return [
                '<div>',
                '<span>#' + index + '</span>',
                "<span class=\"lead\">" + transaction.payer + '</span>',
                '<small class="text-muted">paid</small>',
                '<span class="lead">' + transaction.amount + '</span>',
                '<small class="text-muted">for</small>',
                '<span class="lead">' + transaction.payees.join(', ') + '</span>',
                '<div>',
                '<a href="javascript: void 0;" class="button button-warning" id="create">edit</a>',
                '<a href="javascript: void 0;" class="button button-danger" id="create">delete</a>',
                '</div>',
                '</div>',
                '<hr/>'].join('\n');
        },
        _userBalanceToHtml = function (amount, user) {
            return ['<div>',
                '<span class="lead" style="width: 50%; display: inline-block">' + user + '</span>',
                '<span class="lead">' + _numberRound(amount, 2) + '</span>',
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
        _updateUserBalance = function (userBalance, transaction) {
            _map(transaction.payees, function (person) {
                userBalance[person] = _calcPayeeBalance(transaction, userBalance[person]);
            });
            userBalance[transaction.payer] = _calcPayerBalance(transaction, userBalance[transaction.payer]);
        },
        _render = function () {
            _setInnerHtml($transactionList, _map(transactions, _transactionToHtml).join('\n'));
            _setInnerHtml($netBalanceList, _map(userBalance, _userBalanceToHtml).join('\n'));
        },
        _addTransaction = function (transaction) {
            transactions.push(transaction);
            _updateUserBalance(userBalance, transaction);
        },
        getTransactionFromForm = _flow(_transaction, _toObject, _inputData);

    $create.addEventListener('click', function () {
        var transaction = getTransactionFromForm($newTransaction, TRANSACTION_FIELDS);
        if (!transaction.amount) {
            return;
        }
        _addTransaction(transaction);
        _render();
    });

    _addTransaction({payer: 'Ajay', amount: 300, payees: ['Ajay', 'Vijay', 'Peejay']});
    _render();

})();