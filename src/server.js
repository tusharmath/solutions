"use strict";
var
    _ = require('lodash'),
    koa = require('koa'),
    app = koa(),
    routes = require('./routes'),
    middleware = require('./middleware');

const PORT = 3000
    ;

app
    .use(middleware.logger)
    .use(middleware.jade)
    .use(routes);

app.listen(PORT, _.partial(middleware.start, PORT));
