"use strict";

const Router = require('koa-router');
const api = require(`${process.cwd()}/app/controller/api/`);
const auth = new Router({
  prefix: '/auth'
});
auth.post(`/login`, api.auth.login);
auth.get(`/logout`, api.auth.logout);
module.exports = auth;
