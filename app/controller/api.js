"use strict";

const render = require(`${__dirname}/../lib/render`);
const Mailer = require(`${__dirname}/../service/mail`);
const uuid = require('uuid');
const UserModel = require(`${__dirname}/../model/user`);
const jsonify = JSON.stringify;
const passport = require('../lib/auth.js').passport;
const sign = require('../lib/auth.js').sign;
const co = require('co');


exports.createNewUser = co.wrap(function *(ctx, next) {
  console.log(this.request.body);
  console.log("create new user processes");
  let name = this.request.body.name;
  let mail = this.request.body.mail;
  let password = this.request.body.password;
  let confirm = this.request.body.confirm;
  if (password !== confirm) {
    console.log('failed to vaildate password');
    this.response.status = 400;
    return this.body = jsonify({
      status: 400,
      text: "ユーザー登録失敗",
      data: null
    });
  }
  let result = null;
  try {
    let newUser = new UserModel({
      name: name,
      mail: mail,
      password: password
    });
    result = yield newUser.save();
  } catch (e) {
    console.error(e);
    this.response.status = 500;
    return this.body = jsonify({
      status: 500,
      text: "サーバエラー"
    });
  }
  console.log('--- success user registaration?');
  console.log(result);
  if (!result) {
    this.response.status = 400;
    return this.body = jsonify({
      status: 400,
      text: "ユーザー登録失敗",
      data: null
    });
  }
  return this.body = jsonify({
    status: 200,
    text: "ユーザー登録成功",
    data: result
  });
});

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
    console.log('--- signing jwt ---');
    let token = sign(user);
    console.log(token);
    ctx.login(user);
    return ctx.body = jsonify({
      status: 200,
      text: "ログイン成功",
      data: {
        id: user._id,
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

exports.getCurrentUser = (ctx, next) => {
  return this.body = jsonify({
    status: 200,
    text: "ユーザー取得成功",
    data: ctx.req.user
  });
};

exports.logout = (ctx, next) => {
  console.log('--- logout challange ---');
  ctx.logout();
  return ctx.body = jsonify({
    status: 200,
    text: "ログアウト成功"
  });
};
