"use strict";

const API_VERSION = "v1";
const Router = require('koa-router');
const user = require(`${__dirname}/../controller/user.js`);
const api = require(`${__dirname}/../controller/api.js`);
const router = new Router({
  prefix: `/api/${API_VERSION}`
});
const authCheck = require('../lib/auth.js').middleware;
router.post(`/registar`, api.createNewUser);
router.get(`/user`, authCheck, api.getCurrentUser);
router.post(`/login`, api.login);
router.get(`/logout`, authCheck, api.logout);
router.get(`/check_auth`, authCheck, function(ctx, next) {
  console.log('--- token verify success!!! ---');
  console.log(ctx.request.token);
  return ctx.body = {
    status: 200,
    text: "OK",
    data: ctx.request.token
  };
});
router.post(`/check_auth`, authCheck, function(ctx, next) {
  console.log('--- token verify success!!! ---');
  console.log(ctx.request.token);
  return ctx.body = {
    status: 200,
    text: "OK",
    data: ctx.request.token
  };
});

module.exports = router;
