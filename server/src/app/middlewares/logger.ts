import {NextFunction, Request, Response} from 'express';

import winston from 'winston';
const {combine, timestamp, label, printf} = winston.format;

// const logFormat = winston.format.printf(({level, message, timestamp}) => {
//   return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
// });

// https://stackoverflow.com/questions/51012150/winston-3-0-colorize-whole-output-on-console
const alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: '[LOGGER]',
  }),
  winston.format.timestamp({
    format: 'YY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(
    (info) => `${info.label} [${info.timestamp}] ( ${info.level} ) : ${info.message}`,
  ),
);

// export const logger = winston.createLogger({
//   level: 'debug',
//   transports: [
//     new winston.transports.Console({
//       //format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
//       prettyPrint: true,
//       colorize: true,
//       timestamp: true,
//     }),
//   ],
// });

const colorizer = winston.format.colorize();

const logger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 4,
  },
  format: combine(
    winston.format.timestamp({
      format: 'YY-MM-DD HH:mm:ss',
    }),
    winston.format.simple(),
    winston.format.prettyPrint(),
    winston.format.printf((msg) =>
      colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`),
    ),
  ),
  transports: [new winston.transports.Console()],
});

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  logger.warn(`${req.method} ${req.url} - ${req.ip}`);
  logger.error(`${req.method} ${req.url} - ${req.ip}`);
  next();
}
