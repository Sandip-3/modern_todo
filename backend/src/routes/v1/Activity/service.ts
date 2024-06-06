import { getAllActivity } from "./repository";


export const ActivityService = {
    async getActivitys(id: string) {
        console.log(id)
    const activity = await getAllActivity(id);
    return activity;
  },
};