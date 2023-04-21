import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>('AUTH_ISSUER_BASE_URL')}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: [configService.get('AUTH_AUDIENCE')],
      issuer: configService.get<string>('AUTH_ISSUER_BASE_URL'),
      algorithms: ['RS256'],
    });
  }

  validate(payload: unknown): unknown {
    console.log(payload);
    // only after the JWT was validated you this function is called
    return payload;
  }
}
