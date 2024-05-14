import 'reflect-metadata';
import { db } from './database';
import { config } from './config';
import { ApiServer } from './app';
import { logListen } from './lib/utils';

const main = async () => {
  // initialize database
  await db.connect();
  // create api server
  const apiServer = new ApiServer();
  // extend, PORT and HOST
  const { PORT, HOST } = config;
  // server listen
  apiServer.setup().listen(PORT, HOST, logListen);
};

main();
