import * as winston from 'winston';
import 'winston-daily-rotate-file';
import moment from 'moment';
import 'moment-timezone';
const logDir = 'logs';
const { combine, timestamp, printf } = winston.format;

// Define log format
const logFormat = printf((info) => {
  let date = moment().tz('Asia/Seoul');
  return `${date.format()} ${info.level}: ${info.message}`;
});
const logFormat2 = printf((info) => {
  let date = moment().tz('Asia/Seoul');
  return `${date.format()} ${info.level}: "${info.message}"`;
});

export const apiAccessLogger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    new winston.transports.DailyRotateFile({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/apiAccess/info',
      filename: `%DATE%.log`,
      maxSize: '300m',
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true,
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winston.transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/apiAccess/error', // error.log 파일은 /logs/error 하위에 저장
      filename: `%DATE%.error.log`,
      maxSize: '300m',
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

export const apiPlainLogger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat2,
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/api/info',
      filename: `%DATE%.log`,
      maxSize: '300m',
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/api/error',
      filename: `%DATE%.error.log`,
      maxSize: '300m',
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

export const apiBdsccLogger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat2,
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/bdscc/info',
      filename: `%DATE%.log`,
      maxSize: '300m',
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/bdscc/error',
      filename: `%DATE%.error.log`,
      maxSize: '300m',
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

// Production 환경이 아닌 경우(dev 등)
if (process.env.NODE_ENV !== 'production') {
  apiPlainLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
  apiAccessLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
  apiBdsccLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

apiAccessLogger.stream = {
  write: (message) => {
    apiAccessLogger.info(message);
  },
};
