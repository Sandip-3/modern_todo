import { Router } from 'express';
import UserController from './controller';

const UserRouter = Router();

// Get All the users
UserRouter.route('/').get(UserController.getUsers);

// Verify User
UserRouter.route('/verify').post(UserController.verifyUser);

// Get one user
UserRouter.route('/:id').get(UserController.getUser);

// Create new user
UserRouter.route('/').post(UserController.createUser);

// Update a user
UserRouter.route('/:id').patch(UserController.updateUser);

// Delete a post
// UserRouter.route('/:id').delete();

export default UserRouter;
