import jwt_decode from 'jwt-decode';
// import * as debug from 'debug';
import { NextFunction, Request, Response } from 'express';
import HttpStatusCode from '../../../types/httpStatusCode.type';

// const log = debug('app:auth:middleware');
const AUTHORIZATION_HEADER = 'authorization';
const BEARER = 'Bearer';
export const ROLES_KEY = `${process.env.AUTH_AUDIENCE}/roles`;

export const ROLES = {
  ADMIN: 'admin',
  NORMAL_USER: 'normal-user',
  CUSTOMER: 'customer',
};

export function MinimumPermissionRequired(PERMISSION: string) {
  // TODO: check if user is allowed to gain access by checking his id
  // log('MINIMUM PERMISSION', PERMISSION);
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      req.user &&
      req.user[ROLES_KEY] &&
      req.user[ROLES_KEY].find((value) => value === PERMISSION)
    ) {
      // log('user can perform action to', req.originalUrl);
      next();
    } else {
      // log('user cannot perform action');
      res.status(HttpStatusCode.FORBIDDEN).send({ errors: 'Forbidden' });
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
      // log('decoding token');
      req.user = jwt_decode(req.headers[AUTHORIZATION_HEADER].split(BEARER)[1]);
      // log(JSON.stringify(req.user));
      // log('token decoded');

      next();
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res
      .status(400)
      .send({ err: 'Authorization Header missing with Bearer + JWT' });
  }
}

export function IsEmailVerified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('User:', req.user);
  if (!req.user.email_verified)
    res
      .status(401)
      .send({ message: 'If Email is registered, please verify it.' });
  next();
}
