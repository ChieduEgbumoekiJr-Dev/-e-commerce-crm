import {
  object,
  string,
  boolean,
  nativeEnum,
  array,
  TypeOf,
  number,
} from 'zod';
import Gender from '../types/gender.type';
import moment from 'moment';
import UserStatus from '../types/userStatus.type';
import PermissionLevel from '../types/permisionLevel.type';

const addressSchema = object({
  address: string({
    required_error: 'Address is Required',
  }),
  city: string({
    required_error: 'City is Required',
  }),
  postalCode: string({
    required_error: 'Postal code is Required',
  }).min(3, 'Enter a valid postal code'),
  state: string({}),
  primary: boolean({
    required_error: 'Primary is Required',
  }),
  label: string({
    required_error: 'Label is Required',
  }),
});

// TODO: Add avatar
export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First Name is Required',
    }),
    lastName: string({
      required_error: 'Last Name is Required',
    }),
    gender: nativeEnum(Gender),
    phone: string({}),
    username: string({
      required_error: 'Username is Required',
    })
      .min(3, 'Username is too short - should be at least 3 characters')
      .max(16, 'Username is too long - should be at most 16 characters'),
    birthday: string({
      required_error: 'Birth date is Required',
    }).refine((val) => moment(val, 'YYYY-MM-DD', true).isValid(), {
      message: 'Please enter a valid birth date',
    }),
    addresses: array(addressSchema).nonempty(),
  }),
});

export const createNewUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is Required',
    }).email({
      message: 'Please enter a valid email address',
    }),
    password: string({
      required_error: 'Password is Required',
    })
      .min(8, 'Password is too short - should be at least 8 characters')
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[!@#$%^&*]/, {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: string({
      required_error: 'Password confirmation is Required',
    }),
    firstName: string({
      required_error: 'First Name is Required',
    }),
    lastName: string({
      required_error: 'Last Name is Required',
    }),
    gender: nativeEnum(Gender),
    permissionLevel: nativeEnum(PermissionLevel),
    phone: string({}),
    username: string({
      required_error: 'Username is Required',
    })
      .min(3, 'Username is too short - should be at least 3 characters')
      .max(16, 'Username is too long - should be at most 16 characters'),
    birthday: string({
      required_error: 'Birth date is Required',
    }).refine((val) => moment(val, 'YYYY-MM-DD', true).isValid(), {
      message: 'Please enter a valid birth date',
    }),
    addresses: array(addressSchema).nonempty(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

// TODO: Add password strength check
export const changePasswordSchema = object({
  body: object({
    password: string({
      required_error: 'Password is Required',
    })
      .min(8, 'Password is too short - should be at least 8 characters')
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[!@#$%^&*]/, {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: string({
      required_error: 'Password confirmation is Required',
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});

export const changeEmailSchema = object({
  params: object({
    id: string({
      required_error: 'Id is required',
    }),
  }),
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email({
      message: 'Please enter a valid email address',
    }),
  }),
});

export const updateProfileSchema = object({
  params: object({
    id: string({
      required_error: 'Id is required',
    }),
  }),
  body: object({
    firstName: string({
      required_error: 'First Name is Required',
    }).optional(),
    lastName: string({
      required_error: 'Last Name is Required',
    }).optional(),
    gender: nativeEnum(Gender).optional(),
    phone: string({}).optional(),
    birthday: string({
      required_error: 'Birth date is Required',
    })
      .refine((val) => moment(val, 'YYYY-MM-DD', true).isValid(), {
        message: 'Please enter a valid birth date',
      })
      .optional(),
    addresses: array(addressSchema).nonempty().optional(),
  }),
});

export const updateAccountModeSchema = object({
  params: object({
    id: string({
      required_error: 'Id is required',
    }),
  }),
  body: object({
    status: nativeEnum(UserStatus),
  }),
});

export const deleteUserSchema = object({
  params: object({
    id: string({
      required_error: 'Id is required',
    }),
  }),
});

export const findUserSchema = object({
  params: object({
    id: string({
      required_error: 'Id is required',
    }),
  }),
});

export const getUsersSchema = object({
  body: object({
    offset: number().default(0),
    limit: number().default(50),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type CreateNewUserInput = TypeOf<typeof createNewUserSchema>['body'];
export type ChangePasswordInput = TypeOf<typeof changePasswordSchema>['body'];
export type ChangeEmailInput = TypeOf<typeof changeEmailSchema>;
export type UpdateProfileInput = TypeOf<typeof updateProfileSchema>;
export type UpdateAccountModeInput = TypeOf<typeof updateAccountModeSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>['params'];
export type FindUserInput = TypeOf<typeof findUserSchema>['params'];
export type GetUsersInput = TypeOf<typeof getUsersSchema>['body'];
