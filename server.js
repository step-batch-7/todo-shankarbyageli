const http = require('http');
const app = require('./lib/handlers.js');

const server = new http.Server(app.serve.bind(app));
const port = 8080;
server.listen(port, () => {
  console.log('Started listening on:', port);
});
