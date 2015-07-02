/**
 * Created by tusharmathur on 7/1/15.
 */
(function () {
    "use strict";

    var INDEX_ATTRIBUTE_FIELD_NAME = 'target.attributes.index.value',
        TRANSACTION_FIELDS = ['amount', 'payees', 'payer', 'description'],
        $ = document.querySelector.bind(document),
        $newTransaction = $('#new-transaction'),
        $create = $('#create'),
        $transactionListView = $('#transaction-list'),
        $netBalanceListView = $('#net-balance-list'),
        transactions = [],
        storage = localStorage,
        _commitTransactions = function () {
            storage.setItem('transactions', JSON.stringify(transactions));
        },
        _extractTransactions = function () {
            return JSON.parse(storage.getItem('transactions'));
        },
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
        _reduce = function (arr, cb, memo) {
            var result = memo;
            _map(arr, function (val, key, list) {
                result = cb(result, val, key, list);
            });
            return result;
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
                payer: _trim(transactionRaw.payer),
                description: _trim(transactionRaw.description || '')
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
        _calcTransactionBalance = function (transactions) {
            var _reducer = function (userBalance, transaction) {
                _map(transaction.payees, function (person) {
                    userBalance[person] = _calcPayeeBalance(transaction, userBalance[person]);
                });
                userBalance[transaction.payer] = _calcPayerBalance(transaction, userBalance[transaction.payer]);
                return userBalance;
            };
            return _reduce(transactions, _reducer, {});
        },
        _render = function () {
            var transactionBalance = _calcTransactionBalance(transactions);
            _setInnerHtml($transactionListView, _map(transactions, _transactionToHtml).join('\n'));
            _setInnerHtml($netBalanceListView, _map(transactionBalance, _userBalanceToHtml).join('\n'));
        },
        _add = function (arr, item) {
            arr.unshift(item);
        },
        _equal = function (val1, val2) {
            return val1 === val2;
        },
        _delegate = function (el, ev, selector, cb) {
            el.addEventListener(ev, function (el2) {
                var match = _find(el.querySelectorAll(selector), _equal.bind(null, el2.target));
                if (match) {
                    return cb.apply(null, arguments);
                }
            });
        },
        _delegateTransactionViewClick = _delegate.bind(null, $transactionListView, 'click'),
        _getTransactionForm = _flow(_transaction, _toObject, _getFormData),
        _getNewTransactionForm = _getTransactionForm.bind(null, $newTransaction, TRANSACTION_FIELDS),
        _addTransaction = function (transaction) {
            _add(transactions, transaction);
            _commitTransactions(transactions);
        },
        _removeTransaction = function (i) {
            _remove(transactions, i);
            _commitTransactions(transactions);
        };

    $create.addEventListener('click', function () {
        var transaction = _getNewTransactionForm();
        if (!transaction.amount) {
            return;
        }
        _addTransaction(transaction);
        _render();
        _clearForm($newTransaction, TRANSACTION_FIELDS);
    });

    _delegateTransactionViewClick('.delete-button', function (ev) {
        _removeTransaction(_get(ev, INDEX_ATTRIBUTE_FIELD_NAME));
        _render();
    });

    _delegateTransactionViewClick('.edit-button', function (ev) {
        var i = parseInt(_get(ev, INDEX_ATTRIBUTE_FIELD_NAME), 10);
        var transaction = transactions[i];
        _removeTransaction(i);
        _setInnerHtml($transactionListView, _editTransactionTemplate({transaction, i}));
    });

    _delegateTransactionViewClick('#update', function () {
        var transaction = _getTransactionForm($('#edit-transaction'), ['index'].concat(TRANSACTION_FIELDS));
        _addTransaction(transaction);
        _render();
    });
    _map(_extractTransactions(), _addTransaction);

    _map(transactions, _calcTransactionBalance.bind(null, {}));
    _clearForm($newTransaction, TRANSACTION_FIELDS);
    _render();

})();

