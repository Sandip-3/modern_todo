import { Router } from 'express';
import CommentsController from './controller';
import { requireUser } from '../../../Middleware/requireUser';

const CommentsRouter = Router({ mergeParams: true });

// Create a Comment
CommentsRouter.route('/').post(requireUser, CommentsController.createComment);

// Edit a Comment
CommentsRouter.route('/:commentId').patch(requireUser, CommentsController.updateComment);

// Delete a Comment
CommentsRouter.route('/:commentId').delete(requireUser, CommentsController.deleteComment);

export default CommentsRouter;
