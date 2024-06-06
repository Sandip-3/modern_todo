import { ObjectId } from 'mongoose';
import mongoose from 'mongoose';

export interface ActivityDocument extends Document {
    action?: string;
    task? : string
    userName?: string;
    asignee :ObjectId[]
}

const activitySchema = new mongoose.Schema<ActivityDocument>(
  {
    action: {
      type: String,
      required: [true, 'Action must be defiend'],
      unique: false,
    },
    userName: {
      type: String,
      required: [true, 'Username is Required'],
      unique: false,
        },
        task: {
            type: String,
            required : [true , 'Task is Required']
        },
        asignee: [{
            type : String
        }]
  },
  {
    timestamps: true,
  },
);

export const ActivityModel = mongoose.model<ActivityDocument>('activity', activitySchema);
