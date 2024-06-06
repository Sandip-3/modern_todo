import { Router } from 'express';
import AuthController from './controller';

const AuthRouter = Router();

// Login
AuthRouter.route('/login').post(AuthController.login);
AuthRouter.route('/logout').get(AuthController.logout);

export default AuthRouter;
