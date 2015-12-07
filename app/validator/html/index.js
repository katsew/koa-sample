"use strict";

const REGEXP_HTML = /<("[^"]*"|'[^']*'|[^'">])*>/g;

class HTMLValidator {
  contsructor(option) {
    this.validator = option || REGEXP_HTML;
  }
  validate(html) {
    return !this.validator.test(html);
  }
  static validate() {
    return !REGEXP_HTML.test(arguments[0]);
  }
}

module.exports = HTMLValidator;
