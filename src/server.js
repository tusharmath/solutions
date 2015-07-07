"use strict";
var koa = require('koa'),
    bragi = require('bragi'),
    app = koa();

const port = 3000;

// logger
app.use(function *(next) {
    yield next;
    bragi.log('http', bragi.util.print(this.method, 'green'), this.url);
});

app.listen(port, function () {
    bragi.log('application', bragi.util.symbols.success + `server started:${port}`)
});
