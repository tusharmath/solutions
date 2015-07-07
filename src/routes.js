/**
 * Created by tusharmathur on 7/7/15.
 */
"use strict";
var router = require('koa-router'),
    baseRouter = router(),
    v1 = router(),
    middleware = require('./middleware');

v1.get('/contacts', function *() {
    this.body = {data: [1, 2, 3, 34]};
});
baseRouter.get('/', middleware.renderIndex);
baseRouter.get('/views/:page', middleware.render);
baseRouter.use('/api/v1', v1.routes());

module.exports = baseRouter.routes();