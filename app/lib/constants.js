"use strict";

const __const__ = {
  PORT: process.env.PORT,
  HOST: "localhost:3000",
  PROTOCOL: "http",
  MONGO_HOST: "localhost",
  MONGO_PORT: "27017",
  MONGO_DB_USER: "user",
  MAIL_USER: "test@example.com",
  MAIL_PASSWORD: "password",
  TOKEN_SECRET: "THIS_IS_SAMPLE_SECRET"
};

module.exports = Object.freeze(__const__);
