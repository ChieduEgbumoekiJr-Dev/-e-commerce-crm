import { Document, Schema, model } from 'mongoose';
import PermissionLevel from '../types/permisionLevel.type';
import UserStatus from '../types/userStatus.type';
import Address from './address.model';
import Gender from '../types/gender.type';

export interface IUser extends Document {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  auth0Id: string;
  permissionLevel: PermissionLevel;
  gender: Gender;
  phone: string;
  birthday: Date;
  picture: string;
  status: UserStatus;
  addresses: Address[];
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  auth0Id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  picture: { type: String, required: true },
  birthday: { type: Date, required: true },
  permissionLevel: { type: String, default: PermissionLevel.Member },
  gender: { type: String, required: true },
  status: { type: String, default: UserStatus.Active },
  addresses: [
    {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      state: { type: String },
      primary: { type: Boolean, required: true },
      label: { type: String, required: true },
    },
  ],
});

userSchema.index({ email: 1 });

export default model('User', userSchema);
