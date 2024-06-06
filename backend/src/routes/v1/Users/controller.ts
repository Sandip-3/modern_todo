import { Response, Request } from 'express';
import { errorHandler } from '../../../utils/Error/index';
import { UserBody } from './type';
import UserService from './service';
import { errorResponse, successResponse } from '../../../utils/HttpResponse';
import { NextFunction } from 'express';
import sendMail from '../../../utils/SendMail';
import User from './type';

const UserController = {
  async getUsers(req: Request, res: Response) {
    try {
      const result = await UserService.getUsers();
      if (!result) {
        return errorResponse({
          message: 'No user found.',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'Fetched Users successfully',
        data: result,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  async createUser(req: Request<{}, {}, User>, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const result = await UserService.createUser(body);
      const code: string = result?.code || '';
      const mail = await sendMail(req, res, result.email, code);
      if (!result) {
        return errorResponse({
          message: 'Internal Server Error',
          response: res,
        });
      }
      if (result) {
        return successResponse({
          response: res,
          message: 'Created User Successfully',
          data: { result, mail },
        });
      }
    } catch (error) {
      next(error);
    }
  },
  async verifyUser(req: Request<unknown, unknown, { code: string }>, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;

      const user = await UserService.verifyUser(code);
      if (!user) {
        return errorResponse({
          message: 'Invalid Code',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'Verification Success proceed to login',
      });
    } catch (error) {
      next(error);
    }
  },
  async getUser(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const userDetail = await UserService.getUser(id).select('-password  -refreshToken -updatedAt -createdAt -__v');
      if (!userDetail) {
        return errorResponse({
          message: 'User not found',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'User found',
        data: userDetail,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  async updateUser(req: Request<{ id: string }, unknown, UserBody>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedUser = await UserService.getUpdateUser(id, data);
      if (!updatedUser) {
        return errorResponse({
          message: 'User not found',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'User Update Success',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;
