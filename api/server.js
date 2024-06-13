/**
 * Simple backend, learning the basics from YouTube
 */
// api/server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('../db.json');  
/**nifty lieel trick to acess the right thing
 * 
 */
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

module.exports = (req, res) => {
    server(req, res, finalHandler(req, res));
};

function finalHandler(req, res) {
    res.end(); 
}