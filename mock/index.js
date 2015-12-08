"use strict";

const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const endpoint = require(`${process.cwd()}/service/log`);
io.on('connection', (socket) => {
  console.log('--- connected to the server ---');
  socket.on('log:start', endpoint.start);
  socket.on('log:login', endpoint.login);
});

server.listen(3333);
