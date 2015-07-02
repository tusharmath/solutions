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
        _power = function (num, pow) {
            return Math.pow(num, pow);
        },
        _numberRound = function (number, decimal) {
            var power10 = _power(10, decimal);
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
        _find = function (list, predicate) {
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                if (predicate(obj, i, list)) {
                    return obj;
                }
            }
        },
        _filter = function (list, predicate) {
            var results = [];
            _map(list, function (obj, i, list) {
                if (predicate(obj, i, list)) {
                    results.push(obj);
                }
            });
            return results;
        },
        _all = function (list, predicate) {
            var satisfied = 0;
            _map(list, function () {
                if (predicate.apply(arguments)) {
                    satisfied++;
                }
            });
            return satisfied === list.length;
        },
        _set = function (obj, keyListStr, val) {
            var property = obj, keyList = keyListStr.split('.');
            if (keyList.length > 1) {
                property = _get(obj, _initial(keyList).join('.'));
            }
            if (property) {
                property[_last(keyList)] = val
            }
        },
        _get = function (obj, keyListStr) {
            var temp = obj, keyList = keyListStr.split('.');
            for (var i = 0; i < keyList.length; i++) {
                var key = keyList[i];
                if (temp[key]) {
                    temp = temp[key];
                } else {
                    return;
                }
            }
            return temp;
        },
        _template = function (selector) {
            var str = $(selector).innerHTML.replace(/\n/g, '');
            return eval('(function (obj){return \'' + str.replace(/\{\{/g, '\'+').replace(/}}/g, '+\'') + '\';})')
        },
        _getFormPropertyValueKey = function (field) {
            return _getFormPropertyKey(field) + '.value';
        },
        _getFormPropertyKey = function (field) {
            return 'elements.' + field;
        },
        _getFormValue = function (el, key) {
            return _get(el, _getFormPropertyValueKey(key));
        },
        toKeyValue = function (getter, key) {
            return {
                key: key,
                value: getter(key)
            }
        },
        _getFormData = function (el, keys) {
            return _map(keys, toKeyValue.bind(null, _getFormValue.bind(null, el)));
        },
        _clearFormField = function (el, field) {
            _set(el, _getFormPropertyValueKey(field), '');
        },
        _clearForm = function (el, fields) {
            _map(fields, _clearFormField.bind(null, el));
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
        _isString = function (str) {
            return typeof str === 'string';
        },
        _toArray = function (item) {
            if (_isString(item)) {
                return item.split(',');
            }
            return _map(item, _identity);
        },
        _initial = function (list) {
            return list.slice(0, -1)
        },
        _last = function (arr) {
            return arr[arr.length - 1];
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
        _trim = function (str) {
            return str.trim();
        },
        _remove = function (list, index) {
            list.splice(index, 1);
        },
        _transaction = function (transactionRaw) {
            return {
                payees: _map(_toArray(transactionRaw.payees), _trim),
                amount: Number(transactionRaw.amount),
                payer: _trim(transactionRaw.payer)
            }
        },
        _transactionTemplate = _template('#transaction-html'),
        _balanceTemplate = _template('#balance-html'),
        _editTransactionTemplate = _template('#edit-transaction-html'),
        _transactionToHtml = function (transaction, index) {
            return _transactionTemplate({transaction, index});
        },
        _userBalanceToHtml = function (amount, user) {
            return _balanceTemplate({amount, user, _numberRound});
        },
        _setInnerHtml = function (el, content) {
            _set(el, 'innerHTML', content);
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
            return userBalance;
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
        _ary = function (func, count) {
            return function () {
                return func.apply(null, _toArray(arguments).slice(0, count));
            }
        },
        _invoke = function () {
            var args = _toArray(arguments),
                func = _last(args),
                appliedArgs = _initial(args);
            return func.apply(null, appliedArgs);
        },
        _delegate = function (el, ev, selector, cb) {
            el.addEventListener(ev, function (el2) {
                var match = _find(el.querySelectorAll(selector), _equal.bind(null, el2.target));
                if (match) {
                    return cb.apply(null, arguments);
                }
            });
        },
        _getTransactionFromForm = _flow(_transaction, _toObject, _getFormData);

    $create.addEventListener('click', function () {
        var transaction = _getTransactionFromForm($newTransaction, TRANSACTION_FIELDS);
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

    _delegate($transactionList, 'click', '.edit-button', function (ev) {
        var index = parseInt(ev.target.attributes.index.value, 0);
        var transaction = transactions[index];
        _remove(transactions, index);
        _setInnerHtml($transactionList, _editTransactionTemplate({transaction, index}));
    });

    _delegate($transactionList, 'click', '#update', function () {
        var transaction = _getTransactionFromForm($('#edit-transaction'), ['index'].concat(TRANSACTION_FIELDS));
        _addTransaction(transaction);
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

