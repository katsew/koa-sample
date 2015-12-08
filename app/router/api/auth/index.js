"use strict";

const Router = require('koa-router');
const api = require(`${process.cwd()}/app/controller/api/`);
const authCheck = require(`${process.cwd()}/app/lib/auth.js`).middleware;
const auth = new Router({
  prefix: '/auth'
});
auth.post(`/login`, api.auth.login);
auth.get(`/logout`, api.auth.logout);
auth.get(`/check_token`, authCheck, api.auth.checkAuth);
module.exports = auth;
