import { ManagementClient, Role } from 'auth0';
// import * as debug from 'debug';
import axios from 'axios';
import Address from '../../models/address.model';
import {
  CreateNewUserInput,
  UpdateAccountModeInput,
  UpdateProfileInput,
} from '../../schemas/user.schema';
import Gender from '../../types/gender.type';
import UserStatus from '../../types/userStatus.type';
import debug from 'debug';

const log = debug('app:auth:service');
// const log = debug('app:auth:service');

export class AuthService {
  management: ManagementClient;

  constructor() {
    this.management = new ManagementClient({
      domain: process.env.AUTH_DOMAIN,
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      scope:
        'read:users update:users create:users create:users_app_metadata delete:users delete:users_app_metadata create:client_grants',
    });
  }

  async createUser(createUserDto: CreateNewUserInput) {
    const { email, password, permissionLevel: userRole } = createUserDto;
    const user = await this.management.createUser({
      connection: 'Username-Password-Authentication',
      email,
      password,
      email_verified: false,
      verify_email: false,
    });
    log('auth0 user created for', user.email);

    const roles = await this.management.getRoles();
    const role = roles.find((role: Role) => {
      return role.name === userRole;
    });
    if (role) {
      await this.management.assignRolestoUser(
        { id: user.user_id },
        { roles: [role.id] }
      );
    }
    await this.sendEmailVerification(user.user_id);
    return user;
  }

  async updateNewCreatedUser(
    auth0Id: string,
    fieldsToUpdate: {
      appUserId: string;
      isNewUser: boolean;
      username: string;
      gender: Gender;
      birthday: Date;
      firstName: string;
      lastName: string;
      addresses: Address[];
      status: UserStatus;
    },
    role: string
  ) {
    await this.management.assignRolestoUser({ id: auth0Id }, { roles: [role] });

    return this.management.updateUser(
      { id: auth0Id },
      { app_metadata: { ...fieldsToUpdate } }
    );
  }

  async updateUser(
    auth0Id: string,
    fieldsToUpdate: UpdateProfileInput['body'] | UpdateAccountModeInput['body']
  ) {
    return this.management.updateUser(
      { id: auth0Id },
      { app_metadata: { ...fieldsToUpdate } }
    );
  }

  changePassword(auth0UserId: string, newPassword: string) {
    const data = {
      password: newPassword,
    };
    return this.management.updateUser({ id: auth0UserId }, data);
  }

  async changeEmail(auth0UserId: string, email: string) {
    const data = {
      email: email,
      email_verified: false,
    };
    console.log(auth0UserId);
    return this.management.updateUser({ id: auth0UserId }, data, (err) => {
      if (err) {
        log('Error:', err);
        return;
      }
      this.sendEmailVerification(auth0UserId);
      return;
    });
  }

  async sendEmailVerification(auth0UserId: string) {
    const data = {
      user_id: auth0UserId,
    };
    return this.management.sendEmailVerification(data, (err) => {
      if (err) {
        log('Error:', err);
        return;
      }
      log('Success');

      return;
    });
  }

  // This will send password reset email with the input emailId
  async sendPasswordResetEmail(emailId: string) {
    const options = {
      method: 'POST',
      url:
        'https://' + process.env.AUTH_DOMAIN + '/dbconnections/change_password', //domain like: makinhs.eu.auth0.com
      headers: { 'content-type': 'application/json' },
      data: {
        client_id: process.env.AUTH_CLIENT_ID,
        email: emailId,
        connection: 'Username-Password-Authentication',
      },
    };

    return axios
      .post(options.url, options.data)
      .then(function (response) {
        log(response.data);
        return {
          returnStatusValue: response.data,
        };
      })
      .catch(function (err) {
        throw err.stack;
      });
  }

  async findAndRemoveUserByEmail(email: string) {
    log('Finding auth0 user by email to delete');
    const user = await this.management.getUsersByEmail(email);
    if (user && user[0] && user[0].user_id) {
      log('User found, deleting it');
      return this.management.deleteUser({ id: user[0].user_id });
    } else {
      return 'noAuth0UserFound';
    }
  }

  getRefreshToken(refreshToken) {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('client_id', process.env.AUTH_CLIENT_ID);
    params.append('client_secret', process.env.AUTH_CLIENT_SECRET);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    return axios
      .post(`https://${process.env.AUTH_DOMAIN}/oauth/token`, params, config)
      .then((response) => {
        return response.data.access_token;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  getAccessToken(email, password) {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', email);
    params.append('password', password);
    params.append('audience', process.env.AUTH_AUDIENCE);
    params.append('scope', 'openid profile email offline_access');
    params.append('client_id', process.env.AUTH_CLIENT_ID);
    params.append('client_secret', process.env.AUTH_CLIENT_SECRET);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    return (
      axios
        .post(`https://${process.env.AUTH_DOMAIN}/oauth/token`, params, config)
        // .post(`https://makinhs.eu.auth0.com/oauth/token`, params, config)
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        })
    );
  }

  // async getAccessToken() {
  //   try {
  //     const options = {
  //       method: 'POST',
  //       url: `https://${process.env.AUTH_DOMAIN}/oauth/token`,
  //       headers: { 'content-type': 'application/x-www-form-urlencoded' },
  //       data: {
  //         grant_type: 'client_credentials',
  //         client_id: process.env.AUTH_CLIENT_ID,
  //         client_secret: process.env.AUTH_SECRET,
  //         audience: process.env.AUTH_AUDIENCE,
  //       },
  //     };

  //     const response = await axios.request(options);
  //     const data = response.data;
  //     return data;
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }
}

export default new AuthService();
