import { IS_PUBLIC_KEY } from '@app/utils/constants';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      const request = super.getRequest(context) as Request;

      if (request?.headers?.authorization)
        request.user = jwtDecode(request?.headers?.authorization);

      return true;
    }

    return super.canActivate(context);
  }
}
