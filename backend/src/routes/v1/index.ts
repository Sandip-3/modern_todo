import { Router } from 'express';

import Health from './Health';
import UserRouter from './Users';
import AuthRouter from './Auth';
import CommentsRouter from './Comments';
import TaskRouter from './Tasks';
import TagRouter from './Tag';
import ActivityRouter from './Activity';

const router = Router();

router.use('/health', Health);
router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/tasks', TaskRouter);
router.use('/tags', TagRouter);
router.use('/tasks/:taskId', CommentsRouter);
router.use('/activitys' , ActivityRouter)


/**
 * Import and add your routes here
 * Eg:
 *   router.use('/[route-name]', [Route]);
 */

export default router;
