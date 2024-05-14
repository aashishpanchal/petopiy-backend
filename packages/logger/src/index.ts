import winston from 'winston';
import { prettyPrint } from './formate';
import { LEVEL_LABEL, LEVELS } from './constant';

const logger = winston.createLogger({
  levels: LEVELS,
  level: LEVEL_LABEL,
  format: prettyPrint(),
  transports: [
    new winston.transports.File({
      level: 'info',
      dirname: 'logs',
      filename: 'combined.log',
      format: winston.format.uncolorize(),
    }),
    new winston.transports.File({
      level: 'error',
      dirname: 'logs',
      filename: 'errors.log',
      format: winston.format.uncolorize(),
    }),
    new winston.transports.Console({
      level: 'info',
    }),
  ],
});

export default logger;
