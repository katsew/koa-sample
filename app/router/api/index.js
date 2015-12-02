"use strict";

const API_VERSION = "v1";
const Router = require('koa-router');
const api = require(`${process.cwd()}/app/controller/api/`);
const user = require('./user');
const auth = require('./auth');

const router = new Router({
  prefix: `/api/${API_VERSION}`
});
const authCheck = require(`${process.cwd()}/app/lib/auth.js`).middleware;
router.get(`/check_token`, authCheck, function(ctx, next) {
  return ctx.body = {
    status: 200,
    text: "OK",
    data: ctx.request.token
  };
});

router.use(user.routes(), user.allowedMethods());
router.use(auth.routes(), auth.allowedMethods());
module.exports = router;
