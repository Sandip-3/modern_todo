import mongoose from 'mongoose';
import { Comment } from './types';

export interface CommentDocument extends Document, Comment {
  userId?: string;
  _id?: string;
  userName : string
}

const commentSchema = new mongoose.Schema<CommentDocument>(
  {
    content: {
      type: String,
      required: [true, 'Content is Required'],
      unique: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Author is Required'],
      unique: false,
    },
    userName: {
      type: String,
      required:[true , "Username is required"]
    }
  },
  {
    timestamps: true,
  },
);

export const CommentModel = mongoose.model<CommentDocument>('comment', commentSchema);
