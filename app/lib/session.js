"use strict";

const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const uuid = require('uuid');

module.exports = session({
  genSid() {
    return uuid.v4();
  },
  store: redisStore(),
  ttl: 86400000,
  rolling: false
});
