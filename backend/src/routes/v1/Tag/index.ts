import Router from 'express';
import TagController from './controller';

const TagRouter = Router();

TagRouter.route('/').post(TagController.createTag);
TagRouter.route('/').get(TagController.searchtag);

export default TagRouter;
