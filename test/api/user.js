"use strict";

const app = require('../../app/server.js');
const API_VERSION = "v1";
const API_ENDPOINT = `/api/${API_VERSION}`;
const request = require('supertest').agent(app.listen());
const FIXTURE_MAIL = "mlkato.sandbox@gmail.com";
const FIXTURE_PASSWORD = "password";

describe('POST /login with created user', () => {
  it('should return 200 success login', (done) => {
    request
      .post(`${API_ENDPOINT}/login`)
      .send({
        mail: FIXTURE_MAIL,
        password: FIXTURE_PASSWORD
      })
      .expect(200, done);
  });
});


describe('POST /login with not created user', () => {
  it('should return 400 bad request', (done) => {
    request
      .post(`${API_ENDPOINT}/login`)
      .send({
        mail: "abc@def.ghi",
        password: "1234567890"
      })
      .expect(400, done);
  });
});

describe('GET /logout with auth', () => {
  it('should return 200 success logout', (done) => {
    request
      .post(`${API_ENDPOINT}/login`)
      .send({
        mail: FIXTURE_MAIL,
        password: FIXTURE_PASSWORD
      })
      .expect(200, (err, res) => {
        if (err) return done(err);

        return request
          .get(`${API_ENDPOINT}/logout`)
          .expect(200, done);
      });
  });
});

describe('GET /logout without auth', () => {
  it('should return 400 already logout', (done) => {
    request
      .get(`${API_ENDPOINT}/logout`)
      .expect(400, done);
  });
});

describe('GET /auth_check without auth', () => {

  it('should return 400 not authenticated', (done) => {
    request
      .get(`${API_ENDPOINT}/check_auth`)
      .expect(400, done);
  });
});

describe('GET /auth_check with auth', () => {
  it('should return 200 authenticated', (done) => {
    request
      .post(`${API_ENDPOINT}/login`)
      .send({
        mail: FIXTURE_MAIL,
        password: FIXTURE_PASSWORD
      })
      .expect(200, (err, res) => {
        if (err) return done(err);

        return request
          .get(`${API_ENDPOINT}/check_auth`)
          .expect(200, done);
      });
  });
});
