"use strict";

const REGEXP_MAIL = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

class MailValidator {
  constructor(option) {
    this.validator = option || REGEXP_MAIL;
  }
  validate(mail) {
    return this.validator.test(mail);
  }
  static validate() {
    return REGEXP_MAIL.test(arguments[0]);
  }
}

module.exports = MailValidator;
