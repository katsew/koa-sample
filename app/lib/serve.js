const serveStatic = require('koa-static');
const serve = serveStatic(`${__dirname}/../public`);
module.exports = serve;
