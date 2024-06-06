import { CommentModel } from './model';
import { Comment } from './types';
import { CommentDocument } from './model';


export const createComment = (data: Comment, userId: string , userName : string): Promise<CommentDocument> => {
  const newData = {...data , userId : userId , userName : userName}
  const comment = new CommentModel(newData);
  return comment.save();
};

export const deleteComent = (commentId: string): Promise<CommentDocument | null> => {
  return CommentModel.findByIdAndDelete(commentId);
};

export const getUpdate = (id: string, data: Partial<Comment>) => {
  return CommentModel.findByIdAndUpdate(id, data, { new: true });
};