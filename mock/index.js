"use strict";

const Koa = require('koa');
const app = new Koa();
const cors = require('kcors');
const convert = require('koa-convert');
const endpoint = require(`${process.cwd()}/service/log`);

const Router = require('koa-router');
const router = new Router({
  prefix: '/log'
});
router.get('/start', endpoint.start);
router.get('/login', endpoint.login);
router.get('/registar', endpoint.registar);

app
  .use(convert(cors({
    origin: "*"
  })))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3333);
