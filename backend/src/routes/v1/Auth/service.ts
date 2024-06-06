import CustomError from '../../../utils/Error';
import { getUserByEmail, getUserInfo, updateToken } from '../Users/repository';
import { Auth } from './types';
import { messages } from '../../../utils/Messages';
import { signJwt, verifyJwt } from '../../../utils/Jwt';
import { omit } from '../../../utils';
import { userPrivateFields } from '../Users/model';

const AuthService = {
  async login(data: Auth) {
    const user = await getUserByEmail(data.email);
    const userInfo = await getUserInfo(data.email);
    if (!user) throw new CustomError(messages.auth.invalid_account, 401);
    const isValid = await user.comparePassword(data.password);
    if (!isValid) throw new CustomError(messages.auth.invalid_account, 401);
    const accessToken = signJwt(omit(user.toJSON(), userPrivateFields), 'accessToken' , { expiresIn: '7d' });
    const refreshToken = signJwt({ userId: user._id.toString() }, 'refreshToken', { expiresIn: '30d' });
    user.refreshToken = refreshToken;
    await user.save();
    return {
      accessToken,
      refreshToken,
      userInfo
    };
  },

  async verifyToken(token: string, type: 'accessToken' | 'refreshToken') {
    const user = verifyJwt(token, type);
    console.log(user);
  },

  async logoutUser(email: string) {
    const updatedUser = await updateToken(email);
    return updatedUser;
  },
};

export default AuthService;
