/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Application } from 'express';
import { auth, ConfigParams } from 'express-openid-connect';
import { auth as authJwt } from 'express-oauth2-jwt-bearer';

declare global {
  namespace Express {
    interface Request {
      user: any;
      loggedUser: any;
      accessToken: string;
    }

    interface Response {
      user: any;
      loggedUser: any;
    }
  }
}

/**
 * This middleware checks and validate the access token
 */
export const checkJwt = authJwt({
  audience: process.env.AUTH_AUDIENCE,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
});

export class AuthConfigService {
  app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  config() {
    const config: ConfigParams = {
      authRequired: false,
      auth0Logout: true,
      secret: process.env.AUTH_SECRET,
      baseURL: process.env.AUTH_BASE_URL,
      clientID: process.env.AUTH_CLIENT_ID,
      issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      authorizationParams: {
        response_type: 'code', // This requires you to provide a client secret
        audience: process.env.AUTH_AUDIENCE,
        scope: process.env.AUTH_SCOPE,
      },
      routes: {
        // Override the default login route to use your own login route as shown below
        login: false,
        // Pass a custom path to redirect users to a different
        // path after logout.
      },
    };
    this.app.use(auth(config));
  }
}
