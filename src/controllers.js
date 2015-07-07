/**
 * Created by tusharmathur on 7/7/15.
 */
"use strict";
var
    _ = require('lodash'),
    models = require('./models'),
    Contact = models.Contact;

exports.contacts = {
    find: function *() {
        this.body = yield Contact.find(this.query);
    },
    update: function * (source) {
        var contacts = _.first(yield Contact.find({_id: this.params.id}));
        _.assign(contacts.attributes, _.get(this, source));
        this.body = yield new Contact(contacts.attributes).save();
    },
    remove: function * () {
        this.body = {count: yield Contact.remove({_id: this.params.id})};
    },
    create: function * (source) {
        var c = new Contact(_.get(this, source));
        this.body = yield c.save();
    }
};