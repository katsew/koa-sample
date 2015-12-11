"use strict";
const co = require('co');
const moment = require('moment');
const toJSON = JSON.stringify;
const queryHelper = require('./query-helper.js');
const format = require('./data-formatter.js').format;
const promiseFormat = require('./data-formatter.js').promiseFormat;

exports.getAnalytics = co.wrap(function*(ctx, next) {
  console.log(ctx.req.headers['x-access-name']);
  let accessName = ctx.req.headers['x-access-name'].split(':');
  let dbName = accessName[0];
  let colName = accessName[1];

  let accessDate = ctx.req.headers['x-access-date'].split(':');
  let from = accessDate[0];
  let to = accessDate[1];
  let query = {
    created: {
      $gte: moment(from).toDate(),
      $lt: moment(to).toDate()
    }
  };

  let findByQuery = queryHelper.findByQuery;
  let result = yield findByQuery(dbName, colName, query);
  let formatted = yield format(result);
  console.log(formatted);
  if (formatted != null) {
    console.log('--- success get result ---');
    ctx.body = toJSON({
      status: 200,
      text: "データ取得成功",
      data: formatted,
      owner: ctx.request.decoded
    });
  } else {
    console.log('--- error cannot find result ---');
    return ctx.body = toJSON({
      status: 500,
      text: "データ取得失敗",
      owner: ctx.request.decoded
    });
  }
});
