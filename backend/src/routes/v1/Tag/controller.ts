import { Request, Response, NextFunction } from 'express';
import { Tag } from './types';
import TagService from './service';
import { errorResponse, successResponse } from '../../../utils/HttpResponse';
const TagController = {
  async createTag(req: Request<unknown, unknown, Tag>, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const newTag = await TagService.createTag(data);
      if (!newTag) {
        return errorResponse({
          message: 'Internal Server Error',
          response: res,
        });
      }
      return successResponse({
        message: 'Tag created successfully',
        response: res,
        data: newTag,
      });
    } catch (error) {
      next(error);
    }
  },
  async searchtag(req: Request<unknown, unknown, unknown , {search : string}>, res: Response, next: NextFunction) {
    try {
        const { search } = req.query
        const searchTag = await TagService.searchTag(search);
      if (!searchTag) {
        return errorResponse({
          message: 'No  Tag found',
          response: res,
        });
      }
      return successResponse({
        message: 'Tags Found',
        response: res,
        data: searchTag,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default TagController;
