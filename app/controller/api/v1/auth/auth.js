"use strict";

const UserModel = require(`${process.cwd()}/model/user`);
const jsonify = JSON.stringify;
const passport = require(`${process.cwd()}/lib/auth.js`).passport;
const sign = require(`${process.cwd()}/lib/auth.js`).sign;
const co = require('co');

exports.login = co.wrap(function *(ctx, next) {
  console.log('--- login challenge ---');
  return passport.authenticate('local', { session: false }, function (user, info, status) {
    console.log('--- AUTHENTICATE RESULT ---');
    console.log(user, info, status);
    if (user === false) {
      ctx.response.status = status;
      return ctx.body = jsonify({
        status: status,
        text: info.message
      });
    }
    let token = sign(user);
    ctx.login(user);
    return ctx.body = jsonify({
      status: 200,
      text: "ログイン成功",
      data: {
        id: user.id,
        name: user.name,
        created: user.created
      },
      token: token
    });
  })(ctx, next).catch(function(err) {
    console.log('--- promise rejected ---');
    console.log(err);
    ctx.response.status = 400;
    return ctx.body = jsonify(err);
  });
});

exports.logout = (ctx, next) => {
  console.log('--- logout challange ---');
  return ctx.body = jsonify({
    status: 200,
    text: "ログアウト成功"
  });
};

exports.checkAuth = (ctx, next) => {
  let request = ctx.request;
  console.log(request.decoded);
  return ctx.body = {
    status: 200,
    text: "OK",
    data: {
      user_id: request.decoded._id
    },
    token: request.token
  };
};
