const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');  // Make sure the path to 'db.json' is correct
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = server;
