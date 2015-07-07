/**
 * Created by tusharmathur on 7/7/15.
 */

"use strict";

var jade = require('koa-jade'),
    bragi = require('bragi');

const TICK = bragi.util.symbols.success,
    JADE_OPTIONS = {viewPath: __dirname + '/views'}
    ;

exports.logger = function *(next) {
    yield next;
    bragi.log('http', bragi.util.print(this.method, 'green'), this.url);
};

exports.jade = jade.middleware(JADE_OPTIONS);
exports.render = function * () {
    this.render(this.params.page);
};
exports.renderIndex = function * (){
    this.render('index');
};
exports.start = (port)=>bragi.log('application', TICK + `server started:${port}`);