const jsonServer = require('json-server');
const server = json-server.create();
const router = json-server.router('./db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = (req, res) => {
    server(req, res, () => {
        res.statusCode = 404;
        res.end('Not found');
    });
};
