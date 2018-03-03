const MongoClient = require('mongodb').MongoClient;

const connect = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(process.env.DB_URL, function (err, client) {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    });
  });
}

const db = (client) => {
  return client.db(process.env.DB_NAME);
}


const withDb = (promiseCreator) => {
  return connect()
    .then(client => {
      return promiseCreator(db(client))
        .then(() => {
          return client.close()
        })
        .catch((err) =>{
          client.close();
          throw err;
        })
    });
}


module.exports = {
  connect: connect,
  db: db,
  withDb: withDb
}
