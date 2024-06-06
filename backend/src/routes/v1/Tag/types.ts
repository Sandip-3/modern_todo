import { ObjectId } from "mongoose"

export interface Tag{
    title: string[]
    taskId?: ObjectId
    asignerId : ObjectId
}