import jwt_decode from 'jwt-decode';
// import * as debug from 'debug';
import { NextFunction, Request, Response } from 'express';
import HttpStatusCode from '../../../types/httpStatusCode.type';
import debug from 'debug';

const log = debug('app:auth:middleware');
// const log = debug('app:auth:middleware');
const AUTHORIZATION_HEADER = 'authorization';
const BEARER = 'Bearer';
export const ROLES_KEY = `${process.env.AUTH_AUDIENCE}/roles`;
export const APP_METADATA_KEY = `${process.env.AUTH_AUDIENCE}/app_metadata`;

export const ROLES = {
  ADMIN: 'admin',
  NORMAL_USER: 'normal-user',
  CUSTOMER: 'customer',
};

export function MinimumPermissionRequired(PERMISSION: string) {
  // log('MINIMUM PERMISSION', PERMISSION);
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      req.user &&
      ((req.params.id &&
        req.user[APP_METADATA_KEY].appUserId === req.params.id) ||
        (req.user[ROLES_KEY] &&
          req.user[ROLES_KEY].find((value) => value === PERMISSION)))
    ) {
      log('user can perform action to', req.originalUrl);
      next();
    } else {
      log('user cannot perform action');
      return res.status(HttpStatusCode.FORBIDDEN).send('Forbidden');
    }
  };
}

export function ExtractUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    req.headers[AUTHORIZATION_HEADER] &&
    req.headers[AUTHORIZATION_HEADER].indexOf(BEARER) > -1
  ) {
    try {
      log('decoding token');
      const accessToken = req.headers[AUTHORIZATION_HEADER].split(BEARER)[1];
      req.user = jwt_decode(accessToken);
      log(JSON.stringify(req.user));
      log('token decoded');
      req.accessToken = accessToken;

      next();
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER).send(err);
    }
  } else {
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .send({ err: 'Authorization Header missing with Bearer + JWT' });
  }
}

export function IsEmailVerified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user.email_verified)
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .send({ message: 'If Email is registered, please verify it.' });
  next();
}
