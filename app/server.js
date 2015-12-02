// "use strict";

const Koa = require('koa');
const app = module.exports = new Koa();
const constants = require('./lib/constants');
const serve = require('./lib/serve');
const apiRouter = require('./router').api;
const session = require('./lib/session');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const passport = require('./lib/auth.js').passport;
const convert = require('koa-convert');
const co = require('co');

// Initialize and registar middleware.
app.keys = ["koa-session-cookie"];
app.name = "koa-server";
// app.proxy = true;
app.on("error", function (err, ctx) {
  console.log(err);
  console.log(ctx);
});

app
  .use(convert(cors({
    origin: "*"
  })))
  .use(convert(serve))
  .use(bodyParser())
  .use(convert(session))
  .use(passport.initialize())
  .use(passport.session())
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods())
  .listen(constants.PORT);
