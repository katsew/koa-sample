"use strict";

const mockDb = require(`${process.cwd()}/lib/mongo`);
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Admin = mongoose.mongo.Admin;
const co = require('co');
const toJSON = JSON.stringify;
exports.getGameList = co.wrap(function *(ctx, next) {
  let admin = new Admin(mockDb.db);
  console.log('--- yield start ---');
  yield new Promise(function(resolve, reject) {
    admin.listDatabases((err, result) => {
      if (err != null)
        return reject(err);
      console.log(result);
      console.log(ctx.request.decoded);
      ctx.request.status = 200;
      resolve(toJSON({
        gameList: result.databases,
        owner: {
          user_id: ctx.request.decoded._id,
          name: ctx.request.decoded.name
        }
      }));
    });
  }).then((result) => {
    console.log(result);
    ctx.body = result;
  }).catch((err) => {
    console.log(err);
    ctx.body = toJSON({
      status: 500,
      text: "サーバーエラー"
    })
  });
  console.log('--- yield end ---');
});
exports.getTypeList = co.wrap(function *(ctx, next) {
  console.log(ctx.req.headers['x-access-name']);
  let database;
  try {
    database = mongoose.createConnection(`mongodb://localhost:27017/${ctx.req.headers['x-access-name']}`);
    let gracefulDisconnect = function () {
      database.close(function () {
        console.log("--- database connection exit ---");
        process.exit(0);
      });
    }
    process.on('SIGINT', gracefulDisconnect).on('SIGTERM', gracefulDisconnect);
  } catch (e) {
    console.log('--- something goes wrong! ---');
    console.log(e);
    return ctx.body = toJSON({
      status: 500,
      text: "データ取得失敗",
      owner: ctx.request.decoded
    });
  }
  yield new Promise((resolve, reject) => {
    try {
      database.once('open', () => {
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  }).then(co.wrap(function *() {
    let cols = yield database.db.collections();
    let collections = cols.map((item) => {
      return item.s.name;
    }).filter((item) => {
      return item !== 'system.indexes';
    });
    console.log(collections);
    if (collections.length < 1) {
      return ctx.body = toJSON({
        status: 500,
        text: "データ取得失敗",
        owner: ctx.request.decoded
      });
    }
    ctx.body = toJSON({
      status: 200,
      text: "データ取得成功",
      data: collections,
      owner: ctx.request.decoded
    });
  })).catch((err) => {
    console.log(err);
    return ctx.body = toJSON({
      status: 500,
      text: "データ取得失敗",
      owner: ctx.request.decoded
    });
  });
});
