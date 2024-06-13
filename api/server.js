const jsonServer = require('json-server');
const server = jsonServer.create();
console.log("hi")
const router = jsonServer.router('./db.json'); // This path assumes db.json is in the same directory as server.js
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
console.log("hi");

module.exports = (req, res) => {
    server(req, res, () => {
        res.statusCode = 404;
        res.end('Not found');
    });
};
