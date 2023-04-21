import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

const USER_ROLES_PATH = 'https://incremental.api/roles';
const ROLE_ADMIN = 'admin';

@Injectable()
export class OnlyAdminCanUseRestGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // this is just a test, you can change based on your needs.
    const user = context.getArgs()[0].user;
    const roles = user[USER_ROLES_PATH];
    // do something with the user here.
    return roles && roles.find((value) => value === ROLE_ADMIN);
  }
}
