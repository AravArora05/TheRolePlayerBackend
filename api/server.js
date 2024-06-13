/**
 * Simple backend, learning the basics from YouTube
 */
// api/server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('../db.json');
/**adjusting path */
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = (req, res) => {
    jsonServer.defaults({ readOnly: false })(req, res, () => {
        router.handle(req, res);
    });
};
