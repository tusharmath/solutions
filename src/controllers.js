/**
 * Created by tusharmathur on 7/7/15.
 */
"use strict";
exports.contacts = {
    find: function *() {
        this.body = [1, 2, 3];
    },
    update: function * () {
        this.body = {status: 200};
    },
    remove : function * () {
        this.body = {status: 200};
    },
    create : function * () {
        this.body = {status: 200};
    }
};