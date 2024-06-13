const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('../db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);


module.exports = (req, res) => {
  res.status(200).send('Hello World');
};

module.exports = (req, res) => {
    return server(req, res, finalHandler(req, res));
};



function finalHandler(req, res) {
    res.end(); // Make sure the response ends correctly
}
