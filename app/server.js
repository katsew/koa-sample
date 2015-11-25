// "use strict";

const app = require('koa')();
const constants = require('./lib/constants');
const serve = require('./lib/serve');
const router = require('./lib/router');
const session = require('./lib/session');
const bodyParser = require('koa-bodyparser');

// Initialize and registar middleware.
app.keys = ["koa-session-cookie"];
app.name = "koa-server";

app.on("error", function (err, ctx) {
  console.log(err);
  console.log(ctx);
});

app
  .use(serve)
  .use(bodyParser())
  .use(session);

// Add routing and boot.
router(app);
app.listen(constants.PORT);
