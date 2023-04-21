import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsRestGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // this is just a test, you can change based on your needs.
    const user = context.getArgs()[0].user;

    // do your validation here and return true or false.
    return true;
  }
}
