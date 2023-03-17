// Makes use of the LOG_LEVEL environment flag
// defaults to INFO
//

enum LoggingLevel {
  ERROR,
  INFO,
  DEBUG,
}

type logFn = (message: string, attributes?: Record<string, unknown>) => void;

export const debug: logFn = (message, attributes) => {
  if (!shouldLog(LoggingLevel.DEBUG)) {
    return;
  }

  return log(message, { ...attributes, LEVEL: LoggingLevel.DEBUG });
};

export const info: logFn = (message, attributes) => {
  if (!shouldLog(LoggingLevel.INFO)) {
    return;
  }

  return log(message, { ...attributes, LEVEL: LoggingLevel.INFO });
};

export const error: logFn = (message, attributes) => {
  if (!shouldLog(LoggingLevel.ERROR)) {
    return;
  }

  return log(message, { ...attributes, LEVEL: LoggingLevel.ERROR });
};

const log: logFn = (message, attributes) => {
  const datetime = new Date(Date.now());

  logToConsole(message, datetime, attributes);
};

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

const shouldLog = (level: LoggingLevel) => {
  if (level <= readLogLevel()) {
    return true;
  }
  return false;
};

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
