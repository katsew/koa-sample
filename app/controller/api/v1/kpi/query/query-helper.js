"use strict";

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const wrap = require('co').wrap;
const toJSON = JSON.stringify;

exports.findAll = wrap(function *(dbName, colName) {
  let result = null;
  try {
    console.log('--- try connect db ---');
    let database = mongoose.createConnection(`mongodb://localhost:27017/${dbName}`);
    let gracefulDisconnect = function () {
      database.close(function () {
        console.log("--- database connection exit ---");
        process.exit(0);
      });
    }
    process.on('SIGINT', gracefulDisconnect).on('SIGTERM', gracefulDisconnect);

    yield new Promise((resolve, reject) => {
      database.once('open', () => {
        console.log('--- once connected ---');
        return resolve(true);
      });
    });
    console.log('--- connected to database done ---');
    console.log('--- try get collection ---');
    let cols = yield new Promise((resolve, reject) => {
      database.db.collection(colName, (err, cols) => {
        if (err != null) return reject(err);
        resolve(cols);
      });
    });
    console.log('--- success get collection ---');
    result = yield new Promise((resolve, reject) => {
      cols.find().toArray((err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      });
    });
    console.log(result);
  } catch (e) {
    console.log('--- error on find collection ---');
    console.log(e);
  }
  return result;
});

exports.findByQuery = wrap(function *(dbName, colName, query) {
  let result = null;
  try {
    console.log('--- try connect db ---');
    let database = mongoose.createConnection(`mongodb://localhost:27017/${dbName}`);
    let gracefulDisconnect = function () {
      database.close(function () {
        console.log("--- database connection exit ---");
        process.exit(0);
      });
    }
    process.on('SIGINT', gracefulDisconnect).on('SIGTERM', gracefulDisconnect);

    yield new Promise((resolve, reject) => {
      database.once('open', () => {
        console.log('--- once connected ---');
        return resolve(true);
      });
    });
    console.log('--- connected to database done ---');
    console.log('--- try get collection ---');
    let cols = yield new Promise((resolve, reject) => {
      database.db.collection(colName, (err, cols) => {
        if (err != null) return reject(err);
        resolve(cols);
      });
    });
    console.log('--- success get collection ---');
    result = yield new Promise((resolve, reject) => {
      cols.find(query).toArray((err, docs) => {
        if (err) return reject(err);
        resolve(docs);
      });
    });
    console.log(result);
  } catch (e) {
    console.log('--- error on find collection ---');
    console.log(e);
  }
  return result;
});
