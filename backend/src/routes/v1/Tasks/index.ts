import { requireUser } from './../../../Middleware/requireUser';
import { Router } from 'express';
import TaskController from './controller';

const TaskRouter = Router();
//Get Task Status
TaskRouter.route('/completed/:asigneeId/').get(  TaskController.findTaskStatus);

// Create a Task
TaskRouter.route('/').post(TaskController.createTask);

// Get All Tasks
TaskRouter.route('/').get(TaskController.getAllTasks);

// Get Task
TaskRouter.route('/:id').get(TaskController.getTask);

// Delete Task
TaskRouter.route('/:id').delete(requireUser ,TaskController.deleteTask);

//Update Task
TaskRouter.route('/:id').patch(requireUser , TaskController.updateTask);

// Update Status
TaskRouter.route('/status/:id/').patch(requireUser ,TaskController.updateTaskStatus);

// Get Asignee Task
TaskRouter.route('/asigned/:asigneeId').get(TaskController.findAsignee)

//Get Created Task
TaskRouter.route('/created/:asignerId').get(TaskController.findAsigner);





export default TaskRouter;
