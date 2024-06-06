import { Router } from "express";
import ActivityController from "./controller";


const ActivityRouter = Router()

// Get a Activity
ActivityRouter.route('/:id').get(ActivityController.getActivitys)


export default ActivityRouter;