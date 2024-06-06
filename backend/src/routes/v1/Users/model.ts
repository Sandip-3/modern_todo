import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import CustomError from '../../../utils/Error';
import User from './type';

export const userPrivateFields = ['password', '__v', 'createdAt', 'updatedAt'];

export interface UserDocument extends User {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateRefreshToken(): string;
  generateAccessToken(): string;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    userName: {
      type: String,
      required: [true, 'Name is Required'],
      unique: false,
    },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    code: {
      type: String,
      require: [true, 'Invalid Code'],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) throw new CustomError('Invalid password or email', 401);
  return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<UserDocument>('user', userSchema);
