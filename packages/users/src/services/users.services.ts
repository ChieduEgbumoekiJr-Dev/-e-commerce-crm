/* eslint-disable @typescript-eslint/no-explicit-any */
import { HydratedDocument } from 'mongoose';
import mongooseService from '../common/mongoose.service';
import UserModel, { IUser } from '../models/users.model';
import {
  CreateNewUserInput,
  CreateUserInput,
  UpdateAccountModeInput,
  UpdateProfileInput,
} from '../schemas/user.schema';
import authService from '../common/auth/auth.service';
import PermissionLevel from '../types/permisionLevel.type';
import moment from 'moment';
import { APP_METADATA_KEY } from '../constants/endpoints';
import UserStatus from '../types/userStatus.type';
import debug from 'debug';

const log = debug('app:users:service');

class UsersService {
  async changeEmail(userId: string, email: string) {
    log('Finding user with corosponding id');
    const user = await this.findUserById(userId);
    log('Changing user email to: ' + email);
    user.email = email;
    await user.save();
    log('User saved with new email');
    // return await authService.getAccessToken();
    return;
  }

  async create(
    currentUser: any,
    userCreateInput: CreateUserInput
  ): Promise<IUser> {
    log('Creating User');
    const session = await mongooseService.getMongoose().startSession();
    const { sub: auth0Id, email, picture, birthday } = currentUser;
    const formatedBirthday = moment(birthday).format('MM-DD-YYYY');
    try {
      log('Starting transaction');
      session.startTransaction();
      const user: HydratedDocument<IUser> = new UserModel({
        email,
        auth0Id,
        picture,
        permissionLevel: PermissionLevel.Member,
        firstName: userCreateInput.firstName,
        lastName: userCreateInput.lastName,
        gender: userCreateInput.gender,
        phone: userCreateInput.phone,
        birthday: formatedBirthday,
        username: userCreateInput.username,
        addresses: userCreateInput.addresses,
      });
      log('Saving user');
      await user.save();
      log('Committing transaction');
      await session.commitTransaction();
      log('finishing session');
      await session.endSession();
      return user;
    } catch (error) {
      log('Error:', error);
    }
  }

  async createNewUser(createNewUserInput: CreateNewUserInput): Promise<IUser> {
    try {
      const auth0User = await authService.createUser(createNewUserInput);
      const auth0Id = auth0User.user_id;
      const formatedBirthday = moment(createNewUserInput.birthday).format(
        'MM-DD-YYYY'
      );
      log('Creating User');
      const session = await mongooseService.getMongoose().startSession();
      log('Starting transaction');
      session.startTransaction();
      const user: HydratedDocument<IUser> = new UserModel({
        email: createNewUserInput.email,
        auth0Id,
        picture: auth0User.picture,
        permissionLevel: createNewUserInput.permissionLevel,
        firstName: createNewUserInput.firstName,
        lastName: createNewUserInput.lastName,
        gender: createNewUserInput.gender,
        phone: createNewUserInput.phone,
        birthday: formatedBirthday,
        username: createNewUserInput.username,
        addresses: createNewUserInput.addresses,
        status: UserStatus.Active,
      });
      log('Saving user');
      await user.save();
      log('Committing transaction');
      await session.commitTransaction();
      log('finishing session');
      await session.endSession();
      return user;
    } catch (error) {
      log('Error:', error);
    }
  }

  async findUserById(id: string) {
    log('Finding user by id');
    return UserModel.findById(id);
  }

  async updateUser(
    user: any,
    updateProfileInput: UpdateProfileInput['body']
  ): Promise<{ id: string }> {
    const id = user[APP_METADATA_KEY].appUserId;
    const conditions = {
      _id: id,
    };
    const session = await mongooseService.getMongoose().startSession();
    log('Starting transaction');
    session.startTransaction();
    UserModel.findOneAndUpdate(
      conditions,
      updateProfileInput,
      (error, result) => {
        if (error) {
          throw new Error(error);
        } else {
          log(result);
        }
      }
    );
    await session.commitTransaction();
    log('Finishing session');
    await session.endSession();
    return id;
  }

  async updateAccountMode(
    user: any,
    updateAccountModeInput: UpdateAccountModeInput['body']
  ): Promise<{ id: string }> {
    const id = user[APP_METADATA_KEY].appUserId;
    const conditions = {
      _id: id,
    };
    const session = await mongooseService.getMongoose().startSession();
    log('Starting transaction');
    session.startTransaction();
    UserModel.findOneAndUpdate(
      conditions,
      updateAccountModeInput,
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      }
    );
    await session.commitTransaction();
    log('Finishing session');
    await session.endSession();
    return id;
  }

  async getUsers(offset: number, limit: number): Promise<IUser[]> {
    const session = await mongooseService.getMongoose().startSession();
    log('Starting transaction');
    session.startTransaction();
    const users = await UserModel.find().skip(offset).limit(limit).exec();
    await session.commitTransaction();
    log('Finishing session');
    await session.endSession();
    return users;
  }

  async deleteUser(id: string) {
    try {
      const session = await mongooseService.getMongoose().startSession();
      log('Starting transaction');
      session.startTransaction();
      await UserModel.findById(id).sort({ createdAt: -1 });
      await UserModel.findByIdAndDelete(id);
      await session.commitTransaction();
      log('Finishing session');
      await session.endSession();
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserById(id: string) {
    try {
      log('Get user by id: ' + id);
      return await UserModel.findById(id).sort({ createdAt: -1 });
    } catch (error) {
      console.log(error);
    }
  }

  async isUsernameTaken(username: string) {
    log('Checking if username is taken');
    return await UserModel.find({ username }).exec();
  }

  async isEmailTaken(email: string) {
    log('Checking if email is taken');
    return await UserModel.find({ email }).exec();
  }
}

export default new UsersService();
