"use strict";

const API_VERSION = "v1";
const route = require('koa-route');
const user = require(`${__dirname}/../controller/user.js`);
const api = require(`${__dirname}/../controller/api.js`);
const router = function(app) {

  // Dynamic page
  app.use(route.get("/", user.showSignupPage));
  app.use(route.post("/m/c", user.preRegistar));
  app.use(route.get("/m/r", user.registar));
  app.use(route.post("/u/c", user.createNewUser));
  app.use(route.get("/u/r", user.showCurrentUser));
  app.use(route.post("/user/login", user.login));
  app.use(route.get("/user/logout", user.logout));

  // API base request
  app.use(route.post(`/api/${API_VERSION}/m/c`, api.preRegistar));
  app.use(route.get(`/api/${API_VERSION}/m/r`, api.registar));
  app.use(route.post(`/api/${API_VERSION}/u/c`, api.createNewUser));
  app.use(route.get(`/api/${API_VERSION}/u/r`, api.showCurrentUser));
  app.use(route.post(`/api/${API_VERSION}/login`, api.login));
  app.use(route.get(`/api/${API_VERSION}/logout`, api.logout));
  app.use(route.get(`/api/${API_VERSION}/check_auth`, api.check_auth));
};

module.exports = router;
