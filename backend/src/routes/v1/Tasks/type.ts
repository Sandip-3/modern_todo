import { ObjectId } from "mongoose"

export default interface Task{
    title: string
    description: string
    tags?: Tag
    dueDate: Date
    priority: Priority
    status: Status
    asigner? : ObjectId
    asignee?: ObjectId[]
    comments?: ObjectId[]
    deleted?: boolean  
    asigneeId?:string
}

interface Tag{
    tag : string
}

interface Priority{
    priority : ['Low', 'Medium' , 'High']
}

interface Status{
    status : ['Assigned', 'In Progress' , 'Completed']
}

export  interface TaskBody {
  title?: string;
  description?: string;
  tags?: Tag;
  dueDate?: Date;
  priority?: Priority;
  status?: Status;
  asigner?: ObjectId;
  asignee?: ObjectId[];
  comments?: ObjectId[];
  deleted?: boolean;
}