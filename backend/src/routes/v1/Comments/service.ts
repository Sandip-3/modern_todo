import { Comment } from './types';
import { createComment, deleteComent , getUpdate } from './repository';
import { addCommentToTask, deleteCommentFromTask } from '../Tasks/repository';

export const CommentsService = {
  async createComment(data: Comment, taskId: string, userId: string , userName : string) {
    // console.log(userId)
    const comment = await createComment(data, userId , userName);
    const commentId = comment?._id || '';
    await addCommentToTask(taskId, commentId.toString());
    return comment;
  },

  async updateComment(id: string, data: Partial<Comment>) {
    return getUpdate(id, data);
  },

  async deleteComment(taskID: string, commentID: string) {
    const result = await deleteComent(commentID);
    if (!result) {
      return false;
    }
    const taskUpdate = await deleteCommentFromTask(taskID, commentID);
    if (!taskUpdate) {
      return false;
    }
    return true;
  },
};
