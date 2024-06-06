import { TaskModel } from './model';
import Task, { TaskBody } from './type';
import mongoose from 'mongoose';

export const createTaskRepo = (taskData: Task) => {
  const task = new TaskModel(taskData);
  return task.save();
};

export const getAllTasks = () => {
  const allTasks = TaskModel.find().populate('comments').populate('tags').populate('asignee').sort({ createdAt: -1 });
  return allTasks;
};

export const getTask = (id: string) => {
  const task = TaskModel.findById(id).sort({ createdAt: -1 }).populate('comments');
  return task;
};
export const getCreatedTasks = (asigneeId: string) => {
  const task = TaskModel.find({ asigneeId: asigneeId }).sort({ createdAt: -1 });
  return task;
};

export const findAsignee = (id: string) => {
  const task = TaskModel.find({ asignee: id }).sort({ createdAt: -1 });
  return task;
};

export const findStatus = (id: string, query: string) => {
  const task = TaskModel.find({ asignee: id, status: query }).sort({ createdAt: -1 });
  return task;
};

export const deleteTask = (id: string) => {
  const deleteTask = TaskModel.findByIdAndDelete(id);
  return deleteTask;
};

export const deleteMultipleTasks = (ids: string[]) => {
  return TaskModel.deleteMany({ _id: { $in: ids } });
};

export const updateTask = (id: string, data: TaskBody) => {
  return TaskModel.findByIdAndUpdate(id, data, { new: true }).sort({ createdAt: -1 });
};

export const getUpdateStatus = (id: string, status: string) => {
  return TaskModel.findByIdAndUpdate(id, { $set: { status: status } }, { new: true }).sort({ createdAt: -1 });
};

export const addCommentToTask = async (taskId: string, commentId: string) => {
  const objectIdCommentId = new mongoose.Types.ObjectId(commentId);
  return await TaskModel.findByIdAndUpdate(
    taskId,
    {
      $push: {
        comments: objectIdCommentId,
      },
    },
    { new: true },
  )
    .populate('comments')
    .exec();
};
export const addTagToTask = async (taskId: string, tagId: string) => {
  const objectIdTagId = new mongoose.Types.ObjectId(tagId);
  return await TaskModel.findByIdAndUpdate(
    taskId,
    {
      $push: {
        tags: objectIdTagId,
      },
    },
    { new: true },
  )
    .populate('comments')
    .exec();
};

export const deleteCommentFromTask = async (taskId: string, commentId: string) => {
  const objectIdCommentId = new mongoose.Types.ObjectId(commentId);
  console.log(objectIdCommentId);
  console.log(taskId);
  return await TaskModel.findByIdAndUpdate(
    taskId,
    {
      $pull: {
        comments: objectIdCommentId,
      },
    },
    { new: true },
  );
};
