"use strict";

const render = require(`${__dirname}/../lib/render`);
const Mailer = require(`${__dirname}/../service/mail`);
const uuid = require('uuid');
const UserModel = require(`${__dirname}/../model/user`);
const jsonify = JSON.stringify;

exports.showSignupPage = function *(next) {
  console.log('--- front page ---');
  console.log(this.session);
  if (this.session.user != null) {
    console.log("--- user already login ---");
    return this.response.redirect("/u/r");
  }
  this.body = yield render('index.jade', {name: "anonymous"});
};

exports.preRegistar = function *(next) {
  console.log(this.session);
  console.log(this.request);
  console.log(this.request.body.mail);
  let uniqueId = uuid.v1();
  let mailAddress = this.request.body.mail;
  let mailer = new Mailer(mailAddress, uniqueId);

  if (mailAddress == null) {
    console.log('--- mail address is blank ---');
    this.response.status = 400;
    return this.body = jsonify({
      status: 400,
      text: "Bad request, please confirm your email address!"
    });
  }

  this.session.verificationId = uniqueId;
  this.session.mail = mailAddress;
  try {
    yield mailer.send();
  } catch (e) {
    console.log("--- catch an error on sending mail ---");
    console.log(e);
    this.response.status = 500;
    return this.body = jsonify({
      status: 500,
      text: "Something goes wrong on the server, please contact to the application owner."
    });
  }
  this.body = jsonify({
    status: 200,
    text: "メール送信成功"
  });
  console.log("success render html");
};

exports.registar = function *(next) {
  console.log(this.session);
  console.log(this.request.querystring);
  let uniqueId = this.session.verificationId;
  let query = this.request.querystring;
  if (query === uniqueId) {
    console.log("email verification success!");
    this.body = yield render("user/registar.jade");
  } else {
    console.log("email verification failed....");
    this.body = yield render("error/verify_mail.jade");
  }
};

exports.createNewUser = function *(next) {
  console.log(this.request.body);
  console.log("create new user processes");
  let password = this.request.body.password;
  let confirm = this.request.body.confirm;
  if (password !== confirm) {
    console.log('failed to vaildate password');
    return this.response.redirect("/");
  }
  let result = null;
  try {
    let newUser = new UserModel({
      mail: this.session.mail,
      password: password
    });
    result = yield newUser.save();
  } catch (e) {
    console.error(e);
    return this.response.redirect("/");
  }
  console.log("----- success create new user -----");
  console.log(result);
  this.session = null;
  this.body = yield render("success/create_new_user.jade");

};

exports.login = function *(next) {
  console.log('--- login challenge ---');
  console.log(this.request.body);
  let mail = this.request.body.mail;
  let password = this.request.body.password;
  let result = null;

  try {
    let query = {
      mail: mail,
      password: password
    };
    result = yield UserModel.find(query);
    if (result.length < 1) {
      let result = yield UserModel.find({ mail: mail });
      if (result.length > 0) {
        console.log('--- password incorrect ---');
        this.response.status = 400;
        return this.body = jsonify({
         status: 400,
         text: "ログイン失敗。パスワードが正しくありません。"
        });
      }
      console.log('--- no result found ---');
      this.response.status = 400;
      return this.body = jsonify({
       status: 400,
       text: "ユーザーが登録されていません"
      });
    }
  } catch (e) {
    console.error(e);
    this.response.status = 500;
    return this.body = jsonify({
     status: 500,
     text: "おや？何かがおかしいようですね…"
    });
  }
  console.log('--- success find user ---');
  console.log(result);
  this.session.user = result[0].mail;
  return this.body = jsonify({
    status: 200,
    text: "ログイン成功"
  });
}

exports.showCurrentUser = function *(next) {
  let mail = this.session.user;
  let result = null;
  try {
    let query = {
      mail: mail
    };
    result = yield UserModel.find(query);
  } catch (e) {
    console.error(e);
    return this.response.redirect("/");
  }

  if (result.length < 1) {
    return this.response.redirect("/");
  }
  this.body = yield render("user/index.jade", {name: result[0].name});
}

exports.logout = function *(next) {

  if (this.session.user == null) {
    this.response.status = 400;
    return this.body = jsonify({
      status: 400,
      text: "すでにログアウトしています"
    });
  }
  this.session = null;
  return this.body = jsonify({
    status: 200,
    text: "ログアウト成功"
  });
}

exports.checkAuth = function *(next) {
  let hasSession = this.session != null && this.session.user != null;
  if (hasSession) {
    return this.body = jsonify({
      status: 200,
      text: "認証成功"
    });
  }
  this.response.status = 400;
  this.body = jsonify({
    status: 400,
    text: "認証失敗"
  });
}
