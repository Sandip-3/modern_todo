import { errorHandler } from '../../../utils/Error/index';
import { Request, Response } from 'express';
import { CommentsService } from './service';
import { Comment } from './types';
import { errorResponse, successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';

const CommentsController = {
  async createComment(req: Request<{ taskId: string }, unknown, Comment>, res: Response) {
    try {
      const { taskId } = req.params;
      const body = req.body;
      const userId = res.locals.user._id as string;
      const userName = res.locals.user.userName;
      if (!userId) {
        return errorResponse({
          message: "Unauthorized Access",
          response : res
        })
      }
      console.log(body)
      const result = await CommentsService.createComment(body, taskId, userId, userName);
      if (!result) {
        return errorResponse({
          response: res,
          message: 'Internal Server Error',
        });
      }
      return successResponse({
        response: res,
        message: messages.post.creation_success,
        data: result,
        status: 201,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  async updateComment(req: Request<{ postId: string, commentId : string }>, res: Response) {
    try {
      const { commentId } = req.params;
      const body = req.body;
      const userId = res.locals.user._id as string;
      if (!userId) {
        return errorResponse({
          message: 'Unauthorized Access',
          response: res,
        });
      }
      const result = await CommentsService.updateComment(commentId, body);
      if (!result) {
        return errorResponse({
          message: "Update Error",
          response : res
        })
      }
      return successResponse({
        response: res,
        message: messages.comment.edit_success,
        data: result,
        status: 200,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },

  async deleteComment(
    req: Request<{ taskId: string; commentId: string }, {}, {}, { commentId: string }>,
    res: Response,
  ) {
    try {
      const userId = res.locals.user._id as string;
      if (!userId) {
        return errorResponse({
          message: 'Unauthorized Access',
          response: res,
        });
      }
      const { taskId } = req.params;
      const { commentId } = req.params;
      if (!taskId) {
        return res.status(400).json({ error: 'TaskId is required' });
      }
      const result = await CommentsService.deleteComment(taskId, commentId);
      if (!result) {
        return errorResponse({
          message: 'Error during delete',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: messages.comment.delete_success,
        data: result,
        status: 201,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
};

export default CommentsController;
