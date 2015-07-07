"use strict";

var
    router = require('koa-router'),
    controllers = require('./controllers'),
    v1 = router();

v1
    .get('/contacts', controllers.contacts.find)
    .patch('/contacts/:id', controllers.contacts.update)
    .post('/contacts', controllers.contacts.create)
    .delete('/contacts/:id', controllers.contacts.remove)

    //TODO: Remove before pushing to production
    .get('/update/contacts/:id', controllers.contacts.update)
    .get('/create/contacts', controllers.contacts.create)
    .get('/delete/contacts/:id', controllers.contacts.remove)


;
module.exports = v1.routes();