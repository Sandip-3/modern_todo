import mongoose from 'mongoose';
import { Tag } from './types';

export interface TagDocument extends Tag {}

const tagSchema = new mongoose.Schema<TagDocument>(
  {
    title: [{
      type: String,
      required: true,
    }],
    taskId: 
      {
        type: mongoose.Schema.ObjectId,
        ref: 'task',
        required: true,
      },
    asignerId: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true },
);

export const TagModel = mongoose.model<TagDocument>('tag', tagSchema);
