import app from './app';
import debug from 'debug';

const log = debug('app:server');

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  log(error);
});
