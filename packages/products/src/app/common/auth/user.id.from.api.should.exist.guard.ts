import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from '@nestjs/core';


const USER_APP_META_PATH = 'https://incremental.api/app_metadata';
const USER_ID_KEY = 'appUserId';

@Injectable()
export class UserIdFromApiShouldExistGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    // this is just a test, you can change based on your needs.
    const user = context.getArgs()[0].user;
    console.log(user);
    const appMetaData = user[USER_APP_META_PATH];
    return !!(appMetaData && appMetaData[USER_ID_KEY]);
    // do something with the user here.
  }
}
