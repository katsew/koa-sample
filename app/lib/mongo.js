"use strict";
const CONSTANTS = require(`${process.cwd()}/lib/constants`);
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mockDb = mongoose.createConnection(`mongodb://${CONSTANTS.MONGO_HOST}:${CONSTANTS.MONGO_PORT}/mock`);
const Admin = mongoose.mongo.Admin;
const gracefulDisconnect = function () {
  mongoose.connection.close(function () {
    console.log("db connection exit");
    process.exit(0);
  });
}
process.on('SIGINT', gracefulDisconnect).on('SIGTERM', gracefulDisconnect);

module.exports = mockDb;
