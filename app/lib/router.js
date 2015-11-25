"use strict";

const route = require('koa-route');
const user = require(`${__dirname}/../controller/user.js`);
const router = function(app) {
  app.use(route.get("/", user.showSignupPage));
  app.use(route.post("/m/c", user.preRegistar));
  app.use(route.get("/m/r", user.registar));
  app.use(route.post("/u/c", user.createNewUser));
  app.use(route.get("/u/r", user.showCurrentUser));
  app.use(route.post("/user/login", user.login));
  app.use(route.get("/user/logout", user.logout));
};

module.exports = router;
