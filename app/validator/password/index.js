"use strict";

const VALID_REGEXP = {};

VALID_REGEXP["WEAK"] = /^[a-z\d]{8,15}$/i;
VALID_REGEXP["NORMAL"] = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i;
VALID_REGEXP["STRONG"] = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,15}$/;
VALID_REGEXP["STRONGER"] = /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-\/:-@[-`{-~])[!-~]{8,15}$/i;

class PasswordValidator {
  contsructor(option) {
    if (/WEAK|NORMAL|STRONG|STRONGER/.test(option))
      this.validator = VALID_REGEXP[option];
    else
      this.validator = option || VALID_REGEXP_NORMAL;
  }
  validate(password, confirm) {
    if (this.validate.length !== arguments.length)
      return this.validator.test(password);
    else
      return ((password === confirm) && this.validator.test(password));
  }
  static validate() {
    return VALID_REGEXP["WEAK"].test(arguments[0]);
  }
}

module.exports = PasswordValidator;
