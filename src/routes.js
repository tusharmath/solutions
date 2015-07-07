/**
 * Created by tusharmathur on 7/7/15.
 */
var router = require('koa-router')(),
    middleware = require('./middleware');

router.get('/', middleware.renderIndex);
router.get('/views/:page', middleware.render);
module.exports = router.routes();