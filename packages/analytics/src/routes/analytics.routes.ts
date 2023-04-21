import { Express } from 'express';
import { checkJwt } from '../common/auth/auth.config.service';
import analyticsController from '../controllers/analytics.controller';
import {
  MinimumPermissionRequired,
  ExtractUserMiddleware,
} from '../common/auth/middleware/auth.middleware';
import PermissionLevel from '../types/permisionLevel.type';
import validateResource from '../middleware/validate-resource';
import { createLogSchema } from '../schemas/analytics.schema';
class AnalyticsRoutes {
  app: Express;

  constructor(app: Express) {
    this.app = app;
    this.configureAllRoutes();
  }

  configureAllRoutes() {
    this.app
      .route('/analytics/')
      .all(checkJwt, ExtractUserMiddleware)
      .get(
        MinimumPermissionRequired(PermissionLevel.Admin),
        analyticsController.getLogs
      )
      .post(validateResource(createLogSchema), analyticsController.addLog);
  }
}

export default AnalyticsRoutes;
