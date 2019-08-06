require('dotenv').config();

const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const logger = require('./utils/logger')('Server');

const connectMongoDB = require('./config/mongoDB');

const routes = require('./routes/api');

const app = express();

// configration
const appConfig = config.get('app');
// Middlwares
app.use(
  morgan((tokens, req, res) =>
    [
      `<pid : ${process.pid}> <${appConfig.nodeEnv}>`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' '),
  ),
);

// Connect Database
connectMongoDB();

app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

// Routes
app.use('/', routes);

// 404 error handler
app.use((_req, res) => {
  res.status(404).json({
    err: null,
    msg: '404 Not Found',
    data: null,
  });
});

// Uncaught Exceptions Handler
process.on('uncaughtException', ex => {
  logger.error(ex.message, ex);
  app.use((_req, res) => {
    res.status(500).json({
      err: null,
      msg: '500 Internet Error',
      data: null,
    });
  });
  process.exit(1);
});

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', ex => {
  logger.error(ex.message, ex);
  app.use((_req, res) => {
    res.status(500).json({
      err: null,
      msg: '500 Internet Error',
      data: null,
    });
  });
  process.exit(1);
});

// Port
const port = appConfig.port || '3000';

// Listen
app.listen(port, () => {
  logger.log(`App Listen Successfully To Port ${port}`);
});
