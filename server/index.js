const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const http = require("http")

const sapi = require('./sapi');
const dbconfig = require('./dbconfig');
const app2sapi = require('./app2sapi')
const appService = require('./modules/app/service')

const PORT = process.env.PORT || 5000;
console.log("STARTUJEMY")

const apps = [
  './apps/rsp',
  './apps/chat',
  './apps/paint',
  './apps/avaclone'
]


const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

const server = http.createServer(app);

server.listen(PORT)

/*app.listen(PORT, function () {
  console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
});*/


const rootHandlers = sapi.combineHandlers(
  require('./modules/hello/handlers'),
  require('./modules/user/handlers'),
  require('./modules/lobby/handlers'),
  require('./modules/observer/handlers'),
  require('./modules/app/handlers'),
  ...apps.map(app => app2sapi(app))
);

dbconfig.connect().then(client => {
  sapi.start(server, rootHandlers, dbconfig.db(client));
}).catch(err => console.log(err));
