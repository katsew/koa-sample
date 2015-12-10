"use strict";
const co = require('co');
const toJSON = JSON.stringify;
const queryHelper = require('./query-helper.js');

exports.getAnalytics = co.wrap(function*(ctx, next) {
  console.log(ctx.req.headers['x-access-name']);
  let accessName = ctx.req.headers['x-access-name'].split(':');
  let dbName = accessName[0];
  let colName = accessName[1];
  let findAll = queryHelper.findAll;
  let result = yield findAll(dbName, colName);
  if (result != null) {
    console.log('--- success get result ---');
    ctx.body = toJSON({
      status: 200,
      text: "データ取得成功",
      data: result,
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
