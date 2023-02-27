// Makes use of the LOG_LEVEL environment flag
// defaults to INFO

enum LoggingLevel {
  DEBUG,
  INFO,
  ERROR,
}

type LoggingFn = (message: string, attributes: Record<string, unknown>) => void;

class Logger {
  private level: LoggingLevel;

  constructor() {
    this.level = this._readLogLevel();
  }

  debug: LoggingFn(message, attributes){
    if (this.level < LoggingLevel.DEBUG) {
      return;
    }

    return this._log(message, attributes);
  }

  info(message: string, attributes: Record<string, unknown>) {
    if (this.level < LoggingLevel.INFO) {
      return;
    }

    this._log(message, attributes);
  }

  error(message: string, attributes: Record<string, unknown>) {
    if (this.level < LoggingLevel.ERROR) {
      return;
    }

    this._log(message, attributes);
  }

  private _log(message: string, attributes: Record<string, unknown>) {
    console.log(message, JSON.stringify(attributes));
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
