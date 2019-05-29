const util = require('util');
const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf } = format;

// configration
const appConfig = require('config').get('app');

const winstonLogger = createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss A',
    }),
    printf(
      ({ message, timestamp, name }) =>
        `${timestamp} <${name}> <pid:${process.pid}> <${
          appConfig.nodeEnv
        }> ${message}`,
    ),
  ),
  transports: [new transports.Console()],
});

module.exports = name => {
  const childLogger = winstonLogger.child({ name });
  const logger = {};

  // LOG
  logger.log = message => {
    childLogger.info(message);
  };

  // ERROR
  logger.error = (message, object = null) => {
    if (object) {
      childLogger.error(
        util.formatWithOptions({ colors: true }, `${message} %O`, object),
      );
    } else {
      childLogger.error(message);
    }
  };

  return logger;
};
