/**
 * Created by tusharmathur on 7/7/15.
 */
"use strict";
var router = require('koa-router'),
    baseRouter = router(),
    v1 = require('./v1'),
    middleware = require('./../middleware');

baseRouter.get('/', middleware.renderIndex);
baseRouter.get('/templates/:page', middleware.render);
baseRouter.use('/api/v1', v1);

module.exports = baseRouter.routes();