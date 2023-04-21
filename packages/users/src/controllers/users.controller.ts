/* eslint-disable @typescript-eslint/ban-types */
import { LogEvent, LogEventsType } from '@incremental-project/log-events';
import { NextFunction, Request, Response } from 'express';
import authService from '../common/auth/auth.service';
import { APP_METADATA_KEY } from '../constants/endpoints';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  CreateNewUserInput,
  CreateUserInput,
  DeleteUserInput,
  FindUserInput,
  GetUsersInput,
  UpdateAccountModeInput,
  UpdateProfileInput,
} from '../schemas/user.schema';
import usersServices from '../services/users.services';
import HttpStatusCode from '../types/httpStatusCode.type';
import UserStatus from '../types/userStatus.type';
import convertPermissionToRoleId from '../utils/roles-id';
import debug from 'debug';

const log = debug('app:users:controller');
const logEventEmmiter = new LogEvent();

class UsersController {
  async createUser(
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user;
    if (user[APP_METADATA_KEY]?.username) {
      log('User already exists');
      res
        .status(HttpStatusCode.CONFLICT)
        .send({ errors: ['User already exists'] });
    }
    const userCreateInput = req.body;
    const isUsernameTaken = await usersServices.isUsernameTaken(
      userCreateInput.username
    );
    const isEmailTaken = await usersServices.isEmailTaken(user.email);
    if (isUsernameTaken.length > 0) {
      log('Username is taken');
      return res
        .status(HttpStatusCode.CONFLICT)
        .send({ errors: ['Username taken'] });
    }
    if (isEmailTaken.length > 0) {
      log('User already created using this email.');
      return res
        .status(HttpStatusCode.CONFLICT)
        .send({ errors: ['User already created using this email.'] });
    }
    try {
      const createdUser = await usersServices.create(user, userCreateInput);
      await authService.updateNewCreatedUser(
        createdUser.auth0Id,
        {
          isNewUser: true,
          appUserId: createdUser.id,
          username: createdUser.username,
          gender: createdUser.gender,
          birthday: createdUser.birthday,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          addresses: createdUser.addresses,
          status: UserStatus.Active,
        },
        convertPermissionToRoleId(user.permissionLevel)
      );
      logEventEmmiter.emitPreDefinedEvent(LogEventsType.CREATE, {
        id: user.sub,
        description: 'Created user',
        payload: { ...userCreateInput, password: null, confirmPassword: null },
        accessToken: req.accessToken,
      });
      return res.status(HttpStatusCode.CREATED).send({ id: createdUser.id });
    } catch (error) {
      next(error);
    }
  }

  async createNewUser(
    req: Request<{}, {}, CreateNewUserInput>,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user;
    const userCreateInput = req.body;
    const isUsernameTaken = await usersServices.isUsernameTaken(
      userCreateInput.username
    );
    const isEmailTaken = await usersServices.isEmailTaken(
      userCreateInput.email
    );
    if (isUsernameTaken.length > 0) {
      return res
        .status(HttpStatusCode.CONFLICT)
        .send({ errors: ['Username taken'] });
    }
    if (isEmailTaken.length > 0) {
      return res
        .status(HttpStatusCode.CONFLICT)
        .send({ errors: ['Email taken'] });
    }
    try {
      const createdUser = await usersServices.createNewUser(userCreateInput);
      console.log('created user', createdUser);
      await authService.updateNewCreatedUser(
        createdUser.auth0Id,
        {
          isNewUser: true,
          appUserId: createdUser.id,
          username: createdUser.username,
          gender: createdUser.gender,
          birthday: createdUser.birthday,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          addresses: createdUser.addresses,
          status: UserStatus.Active,
        },
        convertPermissionToRoleId(createdUser.permissionLevel)
      );
      logEventEmmiter.emitPreDefinedEvent(LogEventsType.CREATE, {
        id: user.sub,
        description: 'Created user',
        payload: { ...userCreateInput, password: null, confirmPassword: null },
        accessToken: req.accessToken,
      });
      return res.status(HttpStatusCode.CREATED).send({ id: createdUser.id });
    } catch (error) {
      next(error);
    }
  }

  async changeUserPassword(
    req: Request<{}, {}, ChangePasswordInput>,
    res: Response
  ) {
    const userAuth0Id = req.user.sub;
    const password = req.body.password;

    if (!userAuth0Id.includes('auth0')) {
      return res
        .status(HttpStatusCode.CONFLICT)
        .send({ errors: ['User was set up with SSO cannot change password'] });
    }
    authService.changePassword(userAuth0Id, password);
    logEventEmmiter.emitPreDefinedEvent(LogEventsType.UPDATE, {
      id: userAuth0Id,
      description: 'Changed user password',
      payload: {},
      accessToken: req.accessToken,
    });
    res
      .status(HttpStatusCode.OK)
      .send({ message: 'Password changed successfully' });
  }

  async changeEmailAddress(
    req: Request<ChangeEmailInput['params'], {}, ChangeEmailInput['body']>,
    res: Response,
    next: NextFunction
  ) {
    const id = req.params.id;
    if (
      req.params.id !==
      req.user['https://incremental.api/app_metadata'].appUserId
    ) {
      res.status(HttpStatusCode.FORBIDDEN).send({ errors: ['Forbidden'] });
    }
    const email = req.body.email;
    const isEmailTaken = await usersServices.isEmailTaken(email);
    if (isEmailTaken.length > 0) {
      log('User already created using this email.');
      return res
        .status(HttpStatusCode.CONFLICT)
        .send({ errors: ['Email is taken'] });
    }
    const userAuth0Id = req.user.sub;
    try {
      await authService.changeEmail(userAuth0Id, email);
      const accessToken = await usersServices.changeEmail(id, email);
      logEventEmmiter.emitPreDefinedEvent(LogEventsType.UPDATE, {
        id: userAuth0Id,
        description: 'Changed user email',
        payload: { email },
        accessToken: req.accessToken,
      });
      res.status(HttpStatusCode.OK).send({
        message: 'Email changed successfully',
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request<UpdateProfileInput['params'], {}, UpdateProfileInput['body']>,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user;
    const auth0Id = user.sub;
    const updateProfileInput = req.body;
    try {
      await usersServices.updateUser(user, updateProfileInput);
      await authService.updateUser(auth0Id, updateProfileInput);
      logEventEmmiter.emitPreDefinedEvent(LogEventsType.UPDATE, {
        id: auth0Id,
        description: 'Update user profile',
        payload: updateProfileInput,
        accessToken: req.accessToken,
      });
      return res
        .status(HttpStatusCode.CREATED)
        .send({ message: 'Updated profile successfully' });
    } catch (e) {
      next(e);
    }
  }

  async changeAccountMode(
    req: Request<
      UpdateAccountModeInput['params'],
      {},
      UpdateAccountModeInput['body']
    >,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user;
    const auth0Id = user.sub;
    const updateAccountModeInput = req.body;
    try {
      await usersServices.updateAccountMode(user, updateAccountModeInput);
      await authService.updateUser(auth0Id, updateAccountModeInput);
      logEventEmmiter.emitPreDefinedEvent(LogEventsType.UPDATE, {
        id: auth0Id,
        description: 'Update user mode',
        payload: updateAccountModeInput,
        accessToken: req.accessToken,
      });
      return res
        .status(HttpStatusCode.CREATED)
        .send({ message: 'Profile mode update successfully' });
    } catch (e) {
      next(e);
    }
  }

  async getUsers(
    req: Request<{}, {}, GetUsersInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      const { offset, limit } = req.body;
      const users = await usersServices.getUsers(offset, limit);
      logEventEmmiter.emitPreDefinedEvent(LogEventsType.WATCH, {
        id: user.sub,
        description: 'Watched users',
        payload: {},
        accessToken: req.accessToken,
      });
      return res.status(HttpStatusCode.OK).send({ users });
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(
    req: Request<DeleteUserInput, {}, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      const id = req.params.id;
      const email = user.email;
      await usersServices.deleteUser(id);
      await authService.findAndRemoveUserByEmail(email);
      logEventEmmiter.emitPreDefinedEvent(LogEventsType.DELETE, {
        id: user.sub,
        description: 'Deleted user',
        payload: { id },
        accessToken: req.accessToken,
      });
      return res
        .status(HttpStatusCode.OK)
        .send({ message: 'User deleted successfully' });
    } catch (e) {
      next(e);
    }
  }

  async getUser(
    req: Request<FindUserInput, {}, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const currentUser = req.user;
      const id = req.params.id;
      const user = await usersServices.getUserById(id);
      logEventEmmiter.emitPreDefinedEvent(LogEventsType.WATCH, {
        id: currentUser.sub,
        description: 'Watched user',
        payload: { id },
        accessToken: req.accessToken,
      });
      return res.status(HttpStatusCode.OK).send({ user });
    } catch (error) {
      next(error);
    }
  }
}

export default new UsersController();
