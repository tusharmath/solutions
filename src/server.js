"use strict";
var
    _ = require('lodash'),
    koa = require('koa'),
    app = koa(),
    pub = koa(),
    mount = require('koa-mount'),
    path = require('path'),
    routes = require('./routes'),
    middleware = require('./middleware');

const PORT = 3000;
pub
    .use(require('koa-browserify')({root: __dirname, production: false}))
    .use(require('koa-less')(__dirname + '/public'))
    .use(require('koa-static')(__dirname + '/public'));

app

    .use(middleware.logger)
    .use(require('koa-body-parser')())
    .use(middleware.jade)
    .use(mount('/public', pub))
    .use(routes);

app.listen(PORT, _.partial(middleware.start, PORT));
