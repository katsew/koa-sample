"use strict";

const nodeMailer = require('nodemailer');
const CONSTANTS = require('../lib/constants');
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: CONSTANTS.MAIL_USER,
    pass: CONSTANTS.MAIL_PASSWORD
  }
}, {
  from: CONSTANTS.MAIL_USER,
  headers: {
    "KOA-SERVER-HEADER-FROM": "mlkato"
  }
});

const mailOption = {
  from: CONSTANTS.MAIL_USER,
  to: "",
  subject: "Hey, thanks for your application",
  text: "We are happy you to be here!!",
  html: "",
  debug: true
};

const mailHTML = `
  <b>We are happy you to be here!!</b>
`;

const mailerCallback = function (err, result) {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject();
    }
    return resolve();
  });
};

class Mailer {
  constructor(address, signed) {
    console.log("create new mailer class with assigning mail address.");
    this.address = address;
    this.uniqueId = signed;
  }
  send() {
    let mail = this._createMail();
    console.log("send email to user");
    console.log(mail);
    return transporter.sendMail(mail);
  }
  _createMail() {
    console.log("make node mailer option fullfilled");
    let addr = this.address;
    let htmlText = `
      ${mailHTML}
      <p>${CONSTANTS.PROTOCOL}://${CONSTANTS.HOST}/m/r?${this.uniqueId || Date.now()}</p>
    `;
    return Object.assign(
      {},
      mailOption,
      {
        to: addr,
        html: htmlText
      }
    );
  }
}

module.exports = Mailer;
