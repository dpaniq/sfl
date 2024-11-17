import { Injectable, OnModuleInit, Scope } from '@nestjs/common';
import * as fs from 'node:fs';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'gray',
  },
};

@Injectable({
  scope: Scope.DEFAULT,
})
export class FileLoggerService implements OnModuleInit {
  private logger: winston.Logger;
  private logDir = 'logs';

  onModuleInit() {
    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }

    // winston.addColors(customLevels.colors);

    // Create logger
    this.logger = winston.createLogger({
      // levels: customLevels.levels, // Use custom levels
      levels: customLevels.levels, // Use custom levels
      level: 'info', // Default level,
      transports: [
        new winston.transports.Console({
          level: 'info', // Set the minimum level for console output
          format: winston.format.combine(
            winston.format.colorize({ all: true }), // Colorize the log output
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              // Format the log output for console with timestamp and level
              return meta
                ? `[${timestamp}] ${level}: ${message} \n(${JSON.stringify(meta)})\n`
                : `[${timestamp}] ${level}: ${message}`;
            }),
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: 'error',
          dirname: this.logDir, // Directory for log files
          filename: 'error.%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: '20m',
          maxFiles: '7d', // Keep logs for 14 days
          format: winston.format.combine(
            winston.format.uncolorize(),
            winston.format.timestamp(),
            winston.format.prettyPrint(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              return meta
                ? `[${timestamp}] ${level}: ${message} \n(${JSON.stringify(meta)})\n`
                : `[${timestamp}] ${level}: ${message}`;
            }),
          ),
        }),
      ],
    });
  }
  public info(message: string, data?: Record<string, any>) {
    return this.logger.info(message, data);
  }

  public error(message: string, data?: Record<string, any> & { error?: any }) {
    if (data?.error) {
      console.error(data?.error);
    }

    return data ? this.logger.error(message, data) : this.logger.error(message);
  }

  public debug(message: string, data?: Record<string, any>) {
    return data ? this.logger.debug(message, data) : this.logger.debug(message);
  }
}
