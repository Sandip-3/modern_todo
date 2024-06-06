import mongoose from 'mongoose';
import Task from './type';

export interface TaskDocument extends Task {}

const taskSchema = new mongoose.Schema<TaskDocument>({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  tags: [
    {
      type: String,
    },
  ],
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  status: {
    type: String,
    enum: ['asigned', 'in progress', 'completed'],
    required: true,
  },
  asigner: {
    type: String,
    required: true,
  },
  asigneeId: {
    type: mongoose.Schema.ObjectId,
    required: 'user',
  },
  asignee: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment',
      required: false,
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
});

export const TaskModel = mongoose.model<TaskDocument>('task', taskSchema);
