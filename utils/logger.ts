// Makes use of the LOG_LEVEL environment flag
// defaults to INFO
//

enum LoggingLevel {
  DEBUG,
  INFO,
  ERROR,
}

class Logger {
  private level: LoggingLevel;

  constructor() {
    this.level = this._readLogLevel();
  }

  debug(message: string, attributes?: Record<string, unknown>) {
    if (this.level < LoggingLevel.DEBUG) {
      return;
    }

    return this._log(message, attributes);
  }

  info(message: string, attributes?: Record<string, unknown>) {
    if (this.level < LoggingLevel.INFO) {
      return;
    }

    this._log(message, attributes);
  }

  error(message: string, attributes?: Record<string, unknown>) {
    if (this.level < LoggingLevel.ERROR) {
      return;
    }

    this._log(message, attributes);
  }

  private _log(message: string, attributes?: Record<string, unknown>) {
    const datetime = new Date(Date.now());

    this._logToConsole(message, datetime, attributes);
  }

  private _logToConsole(
    message: string,
    datetime: Date,
    attributes?: Record<string, unknown>
  ) {
    const niceDate = datetime.toUTCString();
    const separator = '-';

    if (attributes) {
      console.log(niceDate, separator, message, JSON.stringify(attributes));
    } else {
      console.log(niceDate, separator, message);
    }
  }

  private _readLogLevel(): LoggingLevel {
    const logLevel = process.env.LOG_LEVEL;

    switch (logLevel) {
      case 'DEBUG': {
        return LoggingLevel.DEBUG;
      }
      case 'INFO': {
        return LoggingLevel.INFO;
      }
      case 'ERROR': {
        return LoggingLevel.ERROR;
      }
      default: {
        return LoggingLevel.INFO;
      }
    }
  }
}

export default Logger;
