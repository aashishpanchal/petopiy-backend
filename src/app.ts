import cors from 'cors';
import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { appRoutes } from './app/app.routes';
import { logHandler, errorHandler } from './middlewares';
import { Express } from 'express';

export class ApiServer {
  public setup() {
    // create application
    const app: Express = express();
    // Middleware
    this.middleware(app);
    // Routers
    this.routers(app);
    // Error Handlers
    this.errorHandler(app);
    // express application
    return app;
  }

  // initialize middlewares
  private middleware(app: Express) {
    app.use(logHandler()); // Log requests
    app.use(cookieParser()); // cookies parsers
    app.use(cors({ origin: '*', credentials: true })); // Cross Origin Resource Sharing (CORS)
    app.use(express.json({ limit: '30mb' })); // Parse JSON requests
    app.use(express.urlencoded({ extended: true, limit: '30mb' }));
    app.use(passport.initialize());
  }

  // initialize routers
  private routers(app: Express) {
    app.use('/api', appRoutes());
    app.all('*', errorHandler.notFound);
  }

  // initialize error handler
  private errorHandler(app: Express) {
    app.use(errorHandler.globalError);
  }
}
