import { Request, Response } from 'express';
import debug from 'debug';

const log = debug('app:auth:controller');
class AuthController {
  login(req: Request, res: Response) {
    log('user logged in, redirecting to profile');
    log(req.body);
    res.oidc.login({ returnTo: '/profile' });
  }

  async profile(req: Request, res: Response) {
    log(`profile endpoint for ${req.oidc.user.sub}`);
    res.send({
      user: req.oidc.user,
      access_token: req?.oidc?.accessToken?.access_token,
      id_token: req?.oidc?.idToken,
    });
  }
}

export default new AuthController();
