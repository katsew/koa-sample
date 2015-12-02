"use strict";

const render = require(`${__dirname}/../lib/render`);
const Mailer = require(`${__dirname}/../service/mail`);
const uuid = require('uuid');
const UserModel = require(`${__dirname}/../model/user`);
const auth = require('../lib/auth.js');

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
  let uniqueId = uuid.v1();
  let mailAddress = this.request.body.mail;
  let mailer = new Mailer(mailAddress, uniqueId);
  this.session.verificationId = uniqueId;
  this.session.mail = mailAddress;
  try {
    yield mailer.send();
  } catch (e) {
    console.log("--- catch an error on sending mail ---");
    console.log(e);
    return this.body = yield render('error/500.jade', {error: e})
  }
  this.body = yield render('success/send_mail.jade');
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
  let name = this.request.body.name;
  let password = this.request.body.password;
  let confirm = this.request.body.confirm;
  if (password !== confirm) {
    console.log('failed to vaildate password');
    return this.response.redirect("/");
  }
  let result = null;
  try {
    let newUser = new UserModel({
      name: name,
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
  let self = this;
  try {
    yield auth.authenticate('local', function *(err, result) {
      console.log('--- authenticate callback ---');
      console.log(err);
      console.log(result);
      if (err || result === false) {
        return self.response.redirect("/");
      }
      console.log(self.session);
      console.log(self.request.user);
      return self.response.redirect("/u/r");
    });
  } catch (e) {
    console.log(e);
    this.response.redirect("/");
  }
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
  this.session = null;
  this.response.redirect("/");
}
