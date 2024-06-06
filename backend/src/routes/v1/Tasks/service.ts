import Task, { TaskBody } from './type';
import {
  createTaskRepo,
  getAllTasks,
  getTask,
  deleteTask,
  getUpdateStatus,
  updateTask,
  getCreatedTasks,
  findAsignee,
  findStatus,
  deleteMultipleTasks,
} from './repository';
const TaskService = {
  async createTask(taskData: Task) {
    const task = await createTaskRepo(taskData);
    return task;
  },

  async getTasks() {
    const allTasks = await getAllTasks();
    return allTasks;
  },
  async findCreatedTask(asigneeId: string) {
    const createdTasks = await getCreatedTasks(asigneeId);
    return createdTasks;
  },
  async getTask(id: string) {
    const task = await getTask(id);
    return task;
  },
  async findTask(id: string) {
    const task = await findAsignee(id);
    return task;
  },
  async findCompleteTask(id: string, query: string) {
    const task = await findStatus(id, query); 
    return task;
  },
  async getDelete(id: string | string[]) {
    if (Array.isArray(id)) {
      const taskDelete = await deleteMultipleTasks(id)
      return taskDelete
    } else {
      const taskDelete = await deleteTask(id);
      return taskDelete;
    }
  },
  async getUpdate(id: string, data: TaskBody) {
    const taskUpdate = await updateTask(id, data);
    return taskUpdate;
  },
  async getStatusUpdate(id: string, status: string) {
    const updateStatus = await getUpdateStatus(id, status);
    return updateStatus
  }
};

export default TaskService;
