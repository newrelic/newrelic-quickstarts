enum LoggingLevel {
  ERROR,
  INFO,
  DEBUG,
}

type logFn = (message: string, attributes?: Record<string, unknown>) => void;

/*
 * Logs at the `DEBUG` level
 */
export const debug: logFn = (message, attributes) => {
  if (!shouldLog(LoggingLevel.DEBUG)) {
    return;
  }

  return log(message, { ...attributes, LEVEL: LoggingLevel.DEBUG });
};

/*
 * Logs at the `INFO` level
 */
export const info: logFn = (message, attributes) => {
  if (!shouldLog(LoggingLevel.INFO)) {
    return;
  }

  return log(message, { ...attributes, LEVEL: LoggingLevel.INFO });
};

/*
 * The lowest level of logging, `ERROR`, this will always be logged if called
 */
export const error: logFn = (message, attributes) => {
  if (!shouldLog(LoggingLevel.ERROR)) {
    return;
  }

  return log(message, { ...attributes, LEVEL: LoggingLevel.ERROR });
};

/*
 * Outputs the log, currently this is just to the console
 * but could be extended.
 */
const log: logFn = (message, attributes) => {
  const datetime = new Date(Date.now());

  logToConsole(message, datetime, attributes);
};

/*
 * Formats and logs to the console
 */
const logToConsole = (
  message: string,
  datetime: Date,
  attributes?: Record<string, unknown>
) => {
  const niceDate = datetime.toUTCString();
  const separator = '-';

  if (attributes) {
    console.log(niceDate, separator, message, JSON.stringify(attributes));
  } else {
    console.log(niceDate, separator, message);
  }
};

/*
 * Determines if a particular log level should be logged based on the
 * set log level.
 */
const shouldLog = (level: LoggingLevel) => {
  if (level <= readLogLevel()) {
    return true;
  }
  return false;
};

/*
 * Reads the log level from the `LOG_LEVEL` environment variable
 * defaults to INFO level
 */
const readLogLevel = (): LoggingLevel => {
  const logLevel = process.env.LOG_LEVEL;

  switch (logLevel) {
    case 'ERROR': {
      // 0
      return LoggingLevel.ERROR;
    }
    case 'INFO': {
      // 1
      return LoggingLevel.INFO;
    }
    case 'DEBUG': {
      //2
      return LoggingLevel.DEBUG;
    }
    default: {
      return LoggingLevel.INFO;
    }
  }
};

export default {
  debug,
  error,
  info,
};
