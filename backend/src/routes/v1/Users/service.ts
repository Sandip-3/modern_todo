import CustomError from '../../../utils/Error';
import generateUniqueSixDigitCode from '../../../utils/CodeGenerator';
import User from './type';
import { createUserRepo, findByIdAndDelete, getAllUsers, getUserByEmail , getUserByCode, deleteCode, getUserById , updateUser } from './repository';
import { UserBody } from './type';

const UserService = {
  async createUser(userData: User) {
    function validateEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    if (!validateEmail(userData.email)) {
      throw new CustomError('Invalid Email', 400);
    }
    const user = await getUserByEmail(userData.email);
    if (user) {
      if (user?.code) {
        await findByIdAndDelete(user._id);
      } else {
        throw new CustomError('User already exists', 401);
      }
    }
    const code = await generateUniqueSixDigitCode();
    userData.code = code;
    console.log(userData);
    return createUserRepo(userData);
  },

  async verifyUser(code: string) {
    const user = await getUserByCode(code);
    const userCode = user?.code;
    if (userCode !== code) {
      throw new CustomError('Invalid Code', 400);
    }
    const user_id = user?._id || {};
    const codeDeletedUser = await deleteCode(user_id);
    if (!codeDeletedUser) {
      throw new CustomError('Register Failed', 500);
    }
    return true;
  },

  getUser(id: string) {
    const user = getUserById(id);
    return user;
  },

  getUsers() {
    return getAllUsers();
  },
  async getUpdateUser(id: string, data: UserBody) {
    const updatedUser = await updateUser(id, data);
    return updatedUser;
  },
};

export default UserService;
