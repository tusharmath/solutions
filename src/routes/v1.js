"use strict";

var
    _ = require('lodash'),
    middleware = require('../middleware'),
    router = require('koa-router'),
    controllers = require('./../controllers'),
    v1 = router(),
    sourceBody = (func) => _.partial(func, 'request.body'),
    sourceQuery = (func) => _.partial(func, 'query'),
    ContactsCtrl = controllers.contacts;

v1
    .get('/contacts', ContactsCtrl.find)
    .patch('/contacts/:id', sourceBody(ContactsCtrl.update))
    .post('/contacts', sourceBody(ContactsCtrl.create))
    .delete('/contacts/:id', ContactsCtrl.remove);

/**
 * Extremely useful for debugging in development mode.
 * TODO: Disable in production env
 */
v1
    .get('/update/contacts/:id', sourceQuery(ContactsCtrl.update))
    .get('/create/contacts', sourceQuery(ContactsCtrl.create, 'query'))
    .get('/delete/contacts/:id', ContactsCtrl.remove);

/**
 * Handle 404 API Requests
 */
v1.all('*', middleware._404);

module.exports = v1.routes();