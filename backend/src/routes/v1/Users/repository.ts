import { UserModel } from './model';
import User from './type';
import { UserBody } from './type';

export const createUserRepo = (userData: User) => {
  const user = new UserModel(userData);
  return user.save();
};

export const getUserByCode = (code: string) => {
  return UserModel.findOne({ code: code }).select('-password');
};

export const getAllUsers = () => {
  return UserModel.find({}).select('-password');
};

export const deleteCode = (_id: object) => {
  return UserModel.findOneAndUpdate({ _id: _id }, { $unset: { code: 1 } });
};

export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email: email });
};

export const getUserInfo = (email: string) => {
  return UserModel.findOne({ email: email }).select('-password -refreshToken -createdAt -updatedAt -__v');
};

export const findByIdAndDelete = (id: object) => {
  return UserModel.findByIdAndDelete(id);
};

export const getUserById = (id: string) => {
  return UserModel.findById(id);
};

export const updateUser = (id: string, data: UserBody) => {
  console.log(data);
  return UserModel.findByIdAndUpdate(id, { userName: data.userName });
};

export const updateToken = (email: string) => {
  return UserModel.updateOne({ email: email }, { $unset: { refreshToken: 1 } });
};
