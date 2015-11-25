const CONSTANTS = require(`${__dirname}/../lib/constants`);
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${CONSTANTS.MONGO_HOST}:${CONSTANTS.MONGO_PORT}/${CONSTANTS.MONGO_DB_USER}`);
const gracefulDisconnect = function () {
  mongoose.connection.close(function () {
    console.log("db connection exit");
    process.exit(0);
  });
}
process.on('SIGINT', gracefulDisconnect).on('SIGTERM', gracefulDisconnect);

const REGEXP_USER_NAME = /^[a-zA-Z0-9\_]+$/;
const REGEXP_MAIL = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
const nameValidator = function (v) {
  return (v.length > 0) && (REGEXP_USER_NAME.test(v));
};
const mailValidator = function (v) {
  return REGEXP_MAIL.test(v);
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous"
  },
  mail: {
    type: String,
    validate: [mailValidator, "Invalid mail address error"],
    unique: true
  },
  password: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now()
  }
}, {collection: "users"});

const User = mongoose.model("User", UserSchema);
module.exports = User;
