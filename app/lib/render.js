"use strict";

const views = require('co-views');
const render = views(`${__dirname}/../views`, {
  map: {
    html: 'jade'
  }
});

module.exports = render;
