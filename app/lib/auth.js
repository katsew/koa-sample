"use strict";

const passport = require('koa-passport');
const Strategy = require('passport-local').Strategy;
const User = require('../model/user.js');
// const jwt = require('jsonwebtoken');
const jwtSign = require('koa-jwt').sign;
const jwtVerify = require('koa-jwt').verify;
const secret = require('../lib/constants.js').TOKEN_SECRET;
const co = require('co');

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

const options = {
  usernameField: 'name',
  passwordField: 'password'
};
passport.use(new Strategy(options, (name, password, done) => {
  User.findOne({ name: name }, (err, user) => {
    if (err) {
      return done({
        status: 500,
        text: "サーバエラーが発生しました"
      }, null);
    }
    if (!user) {
      return done({
        status: 400,
        text: "ユーザーが見つかりませんでした"
      }, null);
    }
    if (!user.verifyPassword(password)) {
      return done({
        status: 400,
        text: "パスワードが違います"
      }, null);
    }
    return done(null, user, {
      message: "ユーザー取得成功"
    }, 200);
  });
}));

const middleware = co.wrap(function *(ctx, next) {
  let token = (ctx.req.body && ctx.req.body.token) || (ctx.req.query && ctx.req.query.token) || ctx.req.headers['x-access-token'] || false;
  if (token) {
    let result = null;
    try {
      result = yield jwtVerify(token, secret);
    } catch (e) {
      ctx.response.status = 400;
      return ctx.body = {
        status: 400,
        text: "トークンが失効しました"
      };
    }

    if (result == null) {
      ctx.response.status = 500;
      return ctx.body = {
        status: 500,
        text: "トークンが失効しました"
      };
    }
    ctx.request.token = token;
    next();

  } else {
    ctx.response.status = 400;
    return ctx.body = {
      status: 400,
      text: "ログインしてください"
    };
  }
});

const sign = function (target, opts) {
  let options = opts || {
    expiresIn: 60*60*24
  };
  console.log(options);
  return jwtSign(target, secret, options);
}

module.exports = {
  passport: passport,
  sign: sign,
  middleware: middleware
};
