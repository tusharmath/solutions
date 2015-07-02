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
        _template = function (selector) {
            var str = $(selector).innerHTML.replace(/\n/g, '');
            return eval('(function (obj){return \'' + str.replace(/\{\{/g, '\'+').replace(/}}/g, '+\'') + '\';})')
        },
        _getFormData = function (el, keys) {
            return _map(keys, function (key) {
                var elements = el.elements;
                return {
                    key: key,
                    value: elements[key] ? elements[key].value : null
                }
            });
        },
        _clearForm = function (el, keys) {
            _map(keys, function (key) {
                if (el.elements[key]) {
                    el.elements[key].value = '';
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
        _remove = function (list, index) {
            list.splice(index, 1);
        },
        _transaction = function (transactionRaw) {
            return {
                payees: _tokenize(transactionRaw.payees),
                amount: parseInt(transactionRaw.amount, 10),
                payer: transactionRaw.payer.trim()
            }
        },
        _transactionTemplate = _template('#transaction-html'),
        _balanceTemplate = _template('#balance-html'),
        _transactionToHtml = function (transaction, index) {
            return _transactionTemplate({transaction, index});
        },
        _userBalanceToHtml = function (amount, user) {
            return _balanceTemplate({amount, user, _numberRound});
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
        _equal = function (val1, val2) {
            return val1 === val2;
        },
        _find = function (list, predicate) {
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                if (predicate(obj, i, list)) {
                    return obj;
                }
            }
        },
        _delegate = function (el, ev, selector, cb) {
            el.addEventListener(ev, function (el2) {
                var match = _find(el.querySelectorAll(selector), _equal.bind(null, el2.target));
                if (match) {
                    return cb.apply(null, arguments);
                }
            });
        },
        getTransactionFromForm = _flow(_transaction, _toObject, _getFormData);

    $create.addEventListener('click', function () {
        var transaction = getTransactionFromForm($newTransaction, TRANSACTION_FIELDS);
        if (!transaction.amount) {
            return;
        }
        _addTransaction(transaction);
        _render();
        _clearForm($newTransaction, TRANSACTION_FIELDS);
    });

    _delegate($transactionList, 'click', '.delete-button', function (ev) {
        _remove(transactions, ev.target.attributes.index.value);
        userBalance = {};
        _map(transactions, _updateUserBalance.bind(null, userBalance));
        _render();
    });

    _map([
        {payer: 'Ajay', amount: 300, payees: ['Ajay', 'Vijay', 'Peejay']},
        {payer: 'Peejay', amount: 100, payees: ['Ajay', 'Vijay']}
    ], _addTransaction);
    _clearForm($newTransaction, TRANSACTION_FIELDS);
    _render();

})();

