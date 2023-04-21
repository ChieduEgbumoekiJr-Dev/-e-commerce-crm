import { Express } from 'express';
import { checkJwt } from '../common/auth/auth.config.service';
import {
  ExtractUserMiddleware,
  IsEmailVerified,
  MinimumPermissionRequired,
} from '../common/auth/middleware/auth.middleware';
import usersController from '../controllers/users.controller';
import validateResource from '../middleware/validate-resource';
import {
  changeEmailSchema,
  changePasswordSchema,
  createNewUserSchema,
  createUserSchema,
  deleteUserSchema,
  findUserSchema,
  getUsersSchema,
  updateAccountModeSchema,
  updateProfileSchema,
} from '../schemas/user.schema';
import PermissionLevel from '../types/permisionLevel.type';

class UsersRoutes {
  app: Express;

  constructor(app: Express) {
    this.app = app;
    this.configureAllRoutes();
  }

  configureAllRoutes() {
    this.app
      .route('/users')
      .all(checkJwt, ExtractUserMiddleware)
      .get(
        validateResource(getUsersSchema),
        MinimumPermissionRequired(PermissionLevel.Admin),
        usersController.getUsers
      )
      .post(validateResource(createUserSchema), usersController.createUser);

    this.app.post(
      '/users/create',
      validateResource(createNewUserSchema),
      ExtractUserMiddleware,
      checkJwt,
      usersController.createNewUser
    );

    this.app.post(
      '/users/:id/change-password',
      validateResource(changePasswordSchema),
      checkJwt,
      ExtractUserMiddleware,
      IsEmailVerified,
      MinimumPermissionRequired(PermissionLevel.Admin),
      usersController.changeUserPassword
    );

    this.app.post(
      '/users/:id/change-email',
      validateResource(changeEmailSchema),
      checkJwt,
      ExtractUserMiddleware,
      IsEmailVerified,
      MinimumPermissionRequired(PermissionLevel.Admin),
      usersController.changeEmailAddress
    );

    this.app.patch(
      '/users/:id/status',
      validateResource(updateAccountModeSchema),
      checkJwt,
      ExtractUserMiddleware,
      IsEmailVerified,
      MinimumPermissionRequired(PermissionLevel.Admin),
      usersController.changeAccountMode
    );

    this.app
      .route('/users/:id')
      .all(
        checkJwt,
        ExtractUserMiddleware,
        IsEmailVerified,
        MinimumPermissionRequired(PermissionLevel.Admin)
      )
      .patch(
        validateResource(updateProfileSchema),
        usersController.updateProfile
      )
      .delete(validateResource(deleteUserSchema), usersController.deleteUser)
      .get(validateResource(findUserSchema), usersController.getUser);

    // this.app.get('/chiedu/', async (req, res, next) => {
    //   await authService.getAccessToken();
    //   res.send({ message: 'Access token' });
    // });
  }
}

export default UsersRoutes;
