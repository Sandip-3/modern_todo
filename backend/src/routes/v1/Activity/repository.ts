import { ActivityDocument, ActivityModel } from './model';
import { Activity } from './types';

export const createActivity = (data: Activity): Promise<ActivityDocument> => {
  const activity = new ActivityModel(data);
  return activity.save();
};

export const getAllActivity = async (id: string) => {
  console.log(id);
  const allActivity = await ActivityModel.find({ asignee: { $in: [id] } }).sort({ createdAt: -1 });
  return allActivity;
};
