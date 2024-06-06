import { NextFunction, Request, Response } from 'express';
import { ActivityService } from './service';
import { successResponse } from '../../../utils/HttpResponse';

const ActivityController = {
    async getActivitys(req: Request<{id :string} ,unknown>, res: Response, next: NextFunction) {
        const { id } = req.params
        console.log(id)
        const activitys = await ActivityService.getActivitys(id);
    return successResponse({
      response: res,
      message: 'Activitys Fetched Success',
      data: activitys,
    });
  },
};

export default ActivityController;
