"use strict";

const UserModel = require(`${process.cwd()}/model/user`);
const jsonify = JSON.stringify;
const sign = require(`${process.cwd()}/lib/auth.js`).sign;
const co = require('co');

exports.create = co.wrap(function *(ctx, next) {
  console.log(ctx.request.body);
  console.log("create new user processes");
  let name = ctx.request.body.name;
  let mail = ctx.request.body.mail;
  let password = ctx.request.body.password;
  let confirm = ctx.request.body.confirm;
  if (password !== confirm) {
    console.log('failed to vaildate password');
    ctx.response.status = 400;
    return ctx.body = jsonify({
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
    ctx.response.status = 500;
    return ctx.body = jsonify({
      status: 500,
      text: "サーバエラー"
    });
  }
  console.log('--- success user registaration?');
  console.log(result);
  if (!result) {
    ctx.response.status = 400;
    return ctx.body = jsonify({
      status: 400,
      text: "ユーザー登録失敗",
      data: null
    });
  }
  return ctx.body = jsonify({
    status: 200,
    text: "ユーザー登録成功",
    data: result
  });
});

exports.getOwner = co.wrap(function *(ctx, next) {
  let decoded = ctx.request.decoded;
  let result = null;
  console.log('--- get current user ---');
  console.log(decoded);
  try {
    result = yield UserModel.findOne({ mail: decoded.mail });
  } catch (e) {
    console.log('--- error get current user ---');
    console.log(e);
    ctx.response.status = 400;
    return ctx.body = jsonify({
      status: 400,
      text: "ユーザー取得失敗"
    });
  }
  let user = {
    id: result._id,
    name: result.name,
    created: result.created
  };
  console.log('--- success get user ---');
  console.log(result);
  return ctx.body = jsonify({
    status: 200,
    text: "ユーザー取得成功",
    data: user
  });
});
