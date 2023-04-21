import { Application } from 'express';
import { requiresAuth } from 'express-openid-connect';
import AuthController from './auth.controller';

export class AuthRoutes {
  app: Application;

  constructor(app: Application) {
    this.app = app;
    this.configureRoutes();
  }

  configureRoutes() {
    this.app.get('/login', AuthController.login);
    this.app.get('/profile', requiresAuth(), AuthController.profile);
  }
}
