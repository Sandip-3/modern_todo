import { Request, Response } from 'express';
import { Auth } from './types';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import { errorHandler } from '../../../utils/Error/index';
import AuthService from './service';

const AuthController = {
  async login(req: Request<unknown, unknown, Auth>, res: Response) {
    try {
      const body = req.body;
      const result = await AuthService.login(body);
      // res.setHeader('Authorization', `Bearer ${result.accessToken}`);
      return successResponse({
        status: 200,
        response: res,
        message: 'Logged in success',
        data: { ...result, accessToken: result.accessToken },
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  async logout(req: Request, res: Response) {
    const userEmail = res.locals.user.email;
    await AuthService.logoutUser(userEmail);
    res.clearCookie('accessToken').clearCookie('refreshToken');
    return successResponse({
      status: 200,
      response: res,
      message: messages.auth.logout_success,
    });
  },
};

export default AuthController;
