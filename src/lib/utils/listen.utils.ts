import chalk from 'chalk';
import logger from '@repo/logger';
import { config } from '@/config';

export const logListen = () => {
  const { PORT, HOST } = config;
  // make url
  const url = `http://${HOST}:${PORT}`;
  // url with text color
  const urlWithColor = chalk.cyan(url);
  // log on console
  logger.info(urlWithColor);
  logger.info(chalk.yellow('Press CTRL+C to stop'));
};
