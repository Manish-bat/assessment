const express = require('express');
const mongoose = require('mongoose');
const ioClient = require('socket.io-client');
const http = require('http');
const { validateMiddleware } = require('../common/middlewares');
const envConfig = require('../common/config/envConfig');
const { processTask } = require('./services');
const startTaskServer = async (serviceName, config, handlers) => {
  try {
    console.log(`Starting ${serviceName} server...`);
    const serverPort = config.port || envConfig.port;
    let mongooseConnection;
    let mongooseClient;
    try {
      mongoose
        .connect(envConfig.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          console.log('connected to DB');
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
      process.exit(1);
    }

    const app = express();
    const server = http.createServer(app);
    const socketIO = require('socket.io')(server);


    app.use(express.json({}));
    app.use(express.urlencoded({ extended: true }));
    Object.keys(handlers).forEach((handlerName) => {
      const routeMiddlewares = handlers[handlerName].routeMiddlewares || [];
      const controller = async (req, res) => {
        const { handler } = handlers[handlerName];
        let files;
        if (req.files) {
          files = req.files;
        }

        const data = {
          ...files,
          ...req.body,
        };
        const handlerResponse = await processTask({
          serviceName,
          handlerName,
          handler,
          data,
          req,
        });

        res.status(200).send(handlerResponse);
      };
      try {
        app
          .route(`/${handlerName}`)
          .post(
            ...routeMiddlewares,
            validateMiddleware(handlers[handlerName].validator),
            controller
          );
      } catch (err) {
        return err;
      }
    });
    const socketClient = ioClient('http://13.232.18.39/');
    socketClient.on('connect', () => {
      console.log('Connected to socket server');
    });

    const io = socketIO.listen(server);
    io.on('connection', (socket) => {
      console.log('Connected to frontend client');

      socketClient.on('dashboard', (data) => {
        socket.emit('data', data);
      });
    });
    app.listen(serverPort, () => {
      console.log('server started');
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = startTaskServer;
