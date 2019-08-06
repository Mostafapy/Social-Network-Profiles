const mongoose = require('mongoose');
const mongoDBConfig = require('config').get('mongoDB');
const logger = require('./../utils/logger')('Config:MongoDB');

const connectDB = async () => {
  const dbUri = mongoDBConfig.uri;

  // CAPTURE APP TERMINATION / RESTART EVENTS
  // To be called when process is restarted or terminated
  const gracefulShutdown = () => mongoose.connection.close();

  // For nodemon restarts
  process.once('SIGUSR2', () => {
    gracefulShutdown()
      .then(() => {
        logger.log(`@process.on('SIGUSR2')`);
        process.kill(process.pid, 'SIGUSR2');
      })
      .catch(err => {
        logger.error(`@process.on('SIGUSR2') [error: %s]`, err.message);
        process.kill(process.pid, 'SIGUSR2');
      });
  });

  // For app termination
  process.on('SIGINT', () => {
    gracefulShutdown()
      .then(() => {
        logger.log(`@process.on('SIGINT') termination (SIGINT)`);
        process.exit(0);
      })
      .catch(err => {
        logger.error(`@process.on('SIGINT') [error: %s]`, err.message);
        process.exit(0);
      });
  });

  // For Heroku app termination
  process.on('SIGTERM', () => {
    gracefulShutdown()
      .then(() => {
        logger.log(`@process.on('SIGTERM') App termination (SIGTERM)`);
        process.exit(0);
      })
      .catch(err => {
        logger.error(`@process.on('SIGTERM') [error: %s]`, err.message);
        process.exit(0);
      });
  });

  mongoose.set('useCreateIndex', true);

  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      reconnectTries: Number.MAX_VALUE,
    });
    logger.log('@mongoose.connect() Successfully connected to mongoDB');
  } catch (err) {
    logger.error(
      `@mongoose.connect() failed connect to mongoDB [error: %s]`,
      err.message,
    );
    gracefulShutdown()
      .then(() => {
        process.exit(1);
      })
      .catch(() => {
        process.exit(1);
      });
  }
};

module.exports = connectDB;
