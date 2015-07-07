/**
 * Created by tusharmathur on 7/7/15.
 */
"use strict";
var models = require('./models'),
    Contact = models.Contact;

exports.contacts = {
    find: function *() {
        this.body = yield Contact.find();
    },
    update: function * () {
        this.body = {status: 200};
    },
    remove: function * () {
        this.body = {status: 200};
    },
    create: function * () {
        var c = new Contact(this.query);
        this.body = yield c.save();
    }
};