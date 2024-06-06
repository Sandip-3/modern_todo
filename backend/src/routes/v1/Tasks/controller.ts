import { Response, Request, NextFunction } from 'express';
import Task, { TaskBody } from './type';
import TaskService from './service';
import { errorResponse, successResponse } from '../../../utils/HttpResponse';
import { createActivity } from '../Activity/repository';

const TaskController = {
  async createTask(req: Request<{}, {}, Task>, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const createdTask = await TaskService.createTask(data);
      if (!createdTask) {
        return errorResponse({
          message: 'Internal Server Error',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'Created Task Successfully',
        data: createdTask,
      });
    } catch (error) {
      next(error);
    }
  },
  async getAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const allTask = await TaskService.getTasks();
      if (!allTask) {
        return errorResponse({
          message: 'Task not found',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'Fetched Tasks Successfully',
        data: allTask,
      });
    } catch (error) {
      next(error);
    }
  },
  async getTask(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const task = await TaskService.getTask(id);
      if (!task) {
        return errorResponse({
          message: 'Task not found',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'Task Fetch Success',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },
  async deleteTask(req: Request<{ id: string | string[] }>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // console.log(typeof id); // string
      // console.log(id); // 665f4a7ead25d7105d88dbce,665f53d4ea7edd318d8f85db
      const ids: string[] = typeof id === 'string' ? id.split(',') : id;
      const Task = await TaskService.getTask(ids[0]);
      if (!Task) {
        return errorResponse({
          message: 'Task not found',
          response: res,
        });
      }
      const assignerId = Task?.asigneeId?.toString();
      const userId = res.locals.user._id;
      if (userId !== assignerId) {
        return errorResponse({
          message: 'Unauthorized User',
          response: res,
        });
      }
      const deleteTask = await TaskService.getDelete(ids);
      if (deleteTask) {
        return successResponse({
          message: 'Task Deleted',
          response: res,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  async updateTask(req: Request<{ id: string }, unknown, TaskBody>, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const { id } = req.params;
      const Task = await TaskService.getTask(id);
      if (!Task) {
        return errorResponse({
          message: 'Task not found',
          response: res,
        });
      }
      const assignerId = Task?.asigneeId?.toString();
      console.log(assignerId);
      console.log(res.locals.user);
      const userId = res.locals.user._id;
      if (userId !== assignerId) {
        return successResponse({
          message: 'Unauthorized User',
          response: res,
        });
      }

      const updatedTask = await TaskService.getUpdate(id, data);
      return successResponse({
        message: 'Task Updated',
        response: res,
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  },
  async updateTaskStatus(
    req: Request<{ id: string }, unknown, unknown, { status: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const { status } = req.query;
      const Task = await TaskService.getTask(id);
      if (!Task) {
        return errorResponse({
          message: 'Task not found',
          response: res,
        });
      }
      const userName = res.locals.user.userName;
      const action = `Moved from ${Task.status} to ${status}`;
      const task = Task.title;
      const asignee = Task.asignee;
      const activityData = {
        userName: userName,
        action: action,
        task: task,
        asignee: asignee,
      };
      await createActivity(activityData);
      const updatedTask = await TaskService.getStatusUpdate(id, status);
      return successResponse({
        message: 'Task Updated',
        response: res,
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  },
  async findAsignee(req: Request<{ asigneeId: string }>, res: Response, next: NextFunction) {
    try {
      const { asigneeId } = req.params;
      const task = await TaskService.findTask(asigneeId);
      if (!task) {
        return errorResponse({
          message: 'No Task',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'Task Fetch Success',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },
  async findAsigner(req: Request<{ asignerId: string }>, res: Response, next: NextFunction) {
    try {
      const { asignerId } = req.params;
      const task = await TaskService.findCreatedTask(asignerId);
      if (!task) {
        return errorResponse({
          message: 'No Task',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'Task Fetch Success',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },
  async findTaskStatus(
    req: Request<{ asigneeId: string }, unknown, unknown, { status: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { status } = req.query;
      const { asigneeId } = req.params;
      const task = await TaskService.findCompleteTask(asigneeId, status);
      if (!task) {
        return errorResponse({
          message: 'No Task',
          response: res,
        });
      }
      return successResponse({
        response: res,
        message: 'Task Fetch Success',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default TaskController;
