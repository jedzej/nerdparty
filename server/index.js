const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const sapi = require('./sapi');
const dbconfig = require('./dbconfig');
const app2sapi = require('./app2sapi')
const appService = require('./modules/app/service')

const PORT = process.env.PORT || 5000;


const apps = [
  './apps/rsp',
  './apps/chat',
  './apps/paint',
  './apps/avaclone'
]


// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
  
  
  const rootHandlers = sapi.combineHandlers(
    require('./modules/hello/handlers'),
    require('./modules/user/handlers'),
    require('./modules/lobby/handlers'),
    require('./modules/observer/handlers'),
    require('./modules/app/handlers'),
    ...apps.map(app => app2sapi(app))
  );

  dbconfig.connect().then(client => {
    sapi.start(PORT, rootHandlers, dbconfig.db(client));
  });
}
