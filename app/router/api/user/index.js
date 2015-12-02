"use strict";

const Router = require('koa-router');
const api = require(`${process.cwd()}/app/controller/api/`);
const authCheck = require(`${process.cwd()}/app/lib/auth.js`).middleware;
const user = new Router({
  prefix: `/user`
});
user.post(`/create`, api.user.create);
user.get(`/owner`, authCheck, api.user.getOwner);

module.exports = user;
