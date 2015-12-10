"use strict";

const Router = require('koa-router');
const api = require(`${process.cwd()}/controller/api/`);
const authCheck = require(`${process.cwd()}/lib/auth.js`).middleware;
const kpi = new Router({
  prefix: `/kpi`
});
kpi.get(`/game_list`, authCheck, api.kpi.collection.getGameList);
kpi.get(`/type_list`, authCheck, api.kpi.collection.getTypeList);
kpi.get(`/analytics`, authCheck, api.kpi.query.getAnalytics);

module.exports = kpi;
