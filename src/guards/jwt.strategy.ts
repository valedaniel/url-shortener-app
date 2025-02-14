import { Payload } from '@app/types/payload';
import { ApplicationEnv } from '@app/utils/application-settings';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ApplicationEnv.JWT_SECRET as string,
    });
  }

  async validate(payload: Payload) {
    return payload;
  }
}
