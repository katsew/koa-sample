"use strict";

const API_VERSION = "v1";
const Router = require('koa-router');
const api = require(`${process.cwd()}/controller/api/`);
const user = require('./user');
const auth = require('./auth');
const kpi = require('./kpi');

const router = new Router({
  prefix: `/api/${API_VERSION}`
});

router.use(user.routes(), user.allowedMethods());
router.use(auth.routes(), auth.allowedMethods());
router.use(kpi.routes(), kpi.allowedMethods());
module.exports = router;
